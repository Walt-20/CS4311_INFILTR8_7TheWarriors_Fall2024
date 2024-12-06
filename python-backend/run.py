from flask import Flask, g, Response, request, jsonify
from flask_cors import CORS
from json import dumps
from neo4j import GraphDatabase, basic_auth
from dotenv import load_dotenv
import bcrypt
import os
 
load_dotenv()
 
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# 'bolt://localhost:7687' for local database
driver = GraphDatabase.driver('bolt://localhost:7687',auth=basic_auth("neo4j",os.environ.get("NEO4J_AUTH_KEY")))
driver.verify_connectivity()
 
def serialize_analyst(user):
    return {
        "username": user.get("username"),
        "password": user.get("password"),
        "token": user.get("token")
    }

@app.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    query = """
    MATCH (u {username: $username})
    RETURN labels(u) AS roles, u.password AS stored_password, u.username AS username
    """
    
    with driver.session() as session:
        result = session.run(query, username=username)
        record = result.single()

    if record:
        stored_password = record["stored_password"]
        roles = record["roles"]
        print(f"Debug: Retrieved roles: {roles}, username: {username}")

        if "Admin" in roles:
            # For Admin, use plain text comparison
            print(f"Debug: Admin login attempt with password {password}")
            if password == stored_password:
                print("Debug: Admin login successful")
                user_data = {
                    "username": record["username"],
                    "roles": roles
                }
                return jsonify({"message": "Login successful", "user": user_data}), 200
            else:
                print("Debug: Admin password mismatch")
        else:
            # For other users (e.g., Analyst), use bcrypt comparison
            print("Debug: Non-admin login attempt with bcrypt")
            if bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
                print("Debug: Analyst login successful")
                user_data = {
                    "username": record["username"],
                    "roles": roles
                }
                return jsonify({"message": "Login successful", "user": user_data}), 200
            else:
                print("Debug: Analyst password mismatch")

        # If the password does not match
        return jsonify({"error": "Invalid username or password"}), 401
    else:
        # If no record is found
        print("Debug: No user found with the provided username")
        return jsonify({"error": "Invalid username or password"}), 401


@app.route("/forgot-password", methods=['POST'])
def verify_token():
    data = request.get_json()
    username = data.get("username")
    token = data.get("token")

    query = """
    MATCH (u:Analyst {username: $username})
    RETURN u.token AS stored_token
    """
    with driver.session() as session:
        result = session.run(query, username=username)
        record = result.single()

    if record:
        stored_token = record["stored_token"]
        if bcrypt.checkpw(token.encode('utf-8'), stored_token.encode('utf-8')):
            return jsonify({"message": "Token verified successfully"}), 200
        else:
            return jsonify({"error": "Invalid username or token"}), 401
    else:
        return jsonify({"error": "Invalid username or token"}), 401

@app.route("/update-password", methods=['POST'])
def update_password():
    data = request.get_json()
    username = data.get("username")
    new_password = data.get("password")

    hashed_new_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())

    query = """
    MATCH (u:Analyst {username: $username})
    SET u.password = $new_password
    RETURN u
    """
    with driver.session() as session:
        result = session.run(query, username=username, new_password=hashed_new_password.decode('utf-8'))
        record = result.single()

    if record:
        return jsonify({"message": "Password updated successfully"}), 200
    else:
        return jsonify({"error": "User not found or password update failed"}), 400

 
def serialize_project(project):
    return {
        "label": "project",
        "id": project.get("id"),
        "parse_path": project.get("project_path",""),
        "upload_path": project.get("upload_path",""),
        "results_path": project.get("results_path",""),
        "name": project.get("name",""),
    }
 
@app.route("/projects",methods=['GET'])
def get_projects():

    data = request.get_json()
    analyst = data.get('analyst')

    records, _, _ = driver.execute_query( #TODO Update query to match for projects instead of everything
        """
        MATCH (a: Analyst {username: $username}) - [:WORKS_ON]->(p:Project) RETURN p;
        """,
        database_="neo4j",
        routing_="r",
        limit=request.args.get("limit", 100)
    )
    nodes = []
    rels = []
    for record in records:
        label, = record["n"].labels
        try:
            if label == "Project":
                nodes.append(serialize_project(record["n"]))
        except KeyError:
            continue
    if request.method == 'GET':
        return Response(dumps({"nodes": nodes, "links": rels}),
                    mimetype="application/json")
    return None

@app.route("/create_project",methods=['POST'])
def create_project():
    nodes = []
    rels = []
 
    data = request.get_json()
    id = data.get('id')
    parse_path = data.get('parse_path')
    upload_path = data.get('upload_path')
    results_path = data.get('results_path')
    name = data.get('name')

    query = """
    CREATE (n:Project {id: $id, parse_path: $parse_path, upload_path: $upload_path, results_path: $results_path, name: $name})
    RETURN n
    """
    with driver.session() as session:
        result = session.run(query, id=id, parse_path=parse_path, upload_path=upload_path, results_path=results_path, name=name)
        record = result.single()

    if record:
        project_node = record["n"]
        nodes.append(serialize_project(project_node))
        return {
            "message": "Project created successfully",
            "nodes": nodes,
            "links": rels
        }
    else:
        return {"error": "Failed to create project"}

@app.route("/link_project",methods=['POST'])
def link_project():
    nodes = []
    rels = []
 
    data = request.get_json()
    username = data.get("username")
    project_id = data.get("project_id")

    query = """
    MATCH (a:Analyst {username: $analyst_username}), (p:Project {id: $project_id})
    CREATE (a)-[:WORKS_ON]->(p)
    RETURN a,p
    """
    with driver.session() as session:
        result = session.run(query, project_id=project_id, analyst_username=username)

    try:
        nodes.append(serialize_project(result["p"]))
        nodes.append(serialize_analyst(result["a"]))
        return {
            "message": "Project linked successfully",
            "nodes": nodes,
            "links": rels
        }
    except KeyError:
        return {"error": "Failed to link project"}

@app.route("/registration", methods=['GET', 'POST'])
def create_analyst():
    nodes = []
    rels = []
 
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        token = data.get('token')

        # Check if username already exists
        check_query = """
        MATCH (n:Analyst {username: $username})
        RETURN n
        """
        with driver.session() as session:
            existing_user = session.run(check_query, username=username).single()
        
        if existing_user:
            # If the user already exists, return an error message
            return jsonify({"error": "Username already exists. Please choose another one."}), 400

        # Proceed with user creation if the username doesn't exist
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        hashed_token = bcrypt.hashpw(token.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        query = """
        CREATE (n:Analyst {username: $username, password: $password, token: $token})
        RETURN n
        """
        with driver.session() as session:
            result = session.run(query, username=username, password=hashed_password, token=hashed_token)
            record = result.single()

        if record:
            analyst_node = record["n"]
            nodes.append(serialize_analyst(analyst_node))
            return {
                "message": "Analyst created successfully",
                "nodes": nodes,
                "links": rels
            }
        else:
            return {"error": "Failed to create analyst"}
 
    elif request.method == 'GET':
        try:
            query = "MATCH (n:Analyst) RETURN n"
            
            with driver.session() as session:
                results = list(session.run(query))
 
            for record in results:
                analyst_node = record["n"]
                nodes.append(serialize_analyst(analyst_node))
 
            return Response(dumps({"nodes": nodes, "links": rels}), mimetype="application/json")
        except Exception as e:
            print(f"Error during GET request: {e}")
            return {"error": "An internal error occurred"}
 
@app.route("/delete_analysts", methods=['POST'])
def delete_analyst_nodes():
    try:
        query = "MATCH (n:Analyst) DETACH DELETE n"
        with driver.session() as session:
            session.run(query)
        return {"message": "All Analyst nodes deleted successfully"}
    except Exception as e:
        print(f"Error during deletion: {e}")
        return {"error": "Failed to delete Analyst nodes"}

@app.route("/analyst-users", methods=["GET"])
def get_analyst_users():
    query = """
    MATCH (a:Analyst)
    RETURN a.username AS username, a.token AS hashed_token
    """
    try:
        with driver.session() as session:
            result = session.run(query)
            users = []
            for record in result:
                hashed_token = record["hashed_token"]
                unhashed_token = bcrypt.hashpw(hashed_token.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                users.append({
                    "username": record["username"],
                    "token": unhashed_token
                })
        return jsonify({"users": users}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch analyst users"}), 500
 
@app.route('/admin-to-user-password', methods=['POST', 'GET'])
def admin_to_user_password():
    data = request.get_json()
    username = data.get('username') 
    new_password = data.get('password') 
    admin_password = data.get('adminPassword')

    admin_query = """
    MATCH (admin:Admin {username: 'admin'})
        RETURN admin.password AS admin_password
    """
    with driver.session() as session:
        admin_record = session.run(admin_query).single()

    if not admin_record:
        return jsonify({"error": "Admin user not found."}), 404

    stored_admin_password = admin_record['admin_password']
    
    if admin_password != stored_admin_password:
        return jsonify({"error": "Invalid admin password."}), 401

    hashed_new_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())

    update_query = """
    MATCH (u:Analyst {username: $username})
    SET u.password = $new_password
    RETURN u.username AS updated_user
    """
    with driver.session() as session:
        analyst_result = session.run(update_query, username=username, new_password=hashed_new_password.decode('utf-8'))
        analyst_record = analyst_result.single()

    if analyst_record:
        return jsonify({"message": f"Password for user {username} updated successfully"}), 200
    else:
        return jsonify({"error": "User not found or password update failed"}), 404

@app.route("/update-admin-password", methods=["POST"])
def update_admin_password():
    data = request.get_json()
    username = data.get("username")
    new_password = data.get("password")

    if not username or not new_password:
        return jsonify({"error": "Username and password are required."}), 400

    if username == "admin":
        try:
            with driver.session() as session:
                query = """
                MATCH (u:Admin {username: $username})
                SET u.password = $password
                RETURN u.username AS username
                """
                result = session.run(query, username=username, password=new_password)
                if result.single():
                    return jsonify({"message": "Admin password updated successfully."}), 200
                else:
                    return jsonify({"error": "Admin not found."}), 404
        except Exception as e:
            return jsonify({"error": "Failed to update admin password."}), 500
    else:
        return jsonify({"error": "Unauthorized action. Only admins can update this password."}), 403

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=8080)
