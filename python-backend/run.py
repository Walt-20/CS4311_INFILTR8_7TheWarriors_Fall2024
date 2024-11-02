from flask import Flask,g,Response,request
from flask_cors import CORS
from json import dumps
from neo4j import GraphDatabase, basic_auth
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)
# 'bolt://localhost:7687' for local database
# 'neo4j+s://36954b0e.databases.neo4j.io' for online
driver = GraphDatabase.driver('neo4j+s://36954b0e.databases.neo4j.io',auth=basic_auth("neo4j",os.environ.get("NEO4J_AUTH_KEY")))
driver.verify_connectivity()

def serialize_user(user):
    return {
        "first_name": user.get("first_name"),
        "last_name": user.get("last_name"),
        "username": user.get("username"),
        "password": user.get("password"),
        "token": user.get("token")
    }

def serialize_project(project):
    return {
        "label": "project",
        "id": project.get("id")
    }

@app.route("/projects",methods=['GET','POST'])
def get_projects():
    records, _, _ = driver.execute_query( #TODO Update query to match for projects instead of everything
        """
        MATCH (n) RETURN n;
        """,
        database_="neo4j",
        routing_="r",
        limit=request.args.get("limit", 100)
    )
    nodes = []
    rels = []
    i = 0
    for record in records:
        label, = record["n"].labels
        try:
            if label == "User":
                nodes.append(serialize_user(record["n"]))
            elif label == "Project":
                nodes.append(serialize_project(record["n"]))
        except KeyError:
            continue
    if request.method == 'GET':
        return Response(dumps({"nodes": nodes, "links": rels}),
                    mimetype="application/json")
    return None

@app.route("/registration", methods=['GET', 'POST'])
def create_analyst():
    nodes = []
    rels = []

    if request.method == 'POST':
        data = request.get_json()
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        username = data.get('username')
        password = data.get('password')
        token = data.get('token')

        query = """
        CREATE (n:Analyst {first_name: $first_name, last_name: $last_name, username: $username, password: $password, token: $token})
        RETURN n
        """

        with driver.session() as session:
            result = session.run(query, first_name=first_name, last_name=last_name, username=username, password=password, token=token)
            record = result.single()

        if record:
            analyst_node = record["n"]
            nodes.append(serialize_user(analyst_node))
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
                nodes.append(serialize_user(analyst_node))

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


if __name__ == "__main__":
    app.run(host="0.0.0.0",port=8080)