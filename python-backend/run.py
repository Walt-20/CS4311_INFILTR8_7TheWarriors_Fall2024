from flask import Flask,g,Response,request
from json import dumps
from neo4j import GraphDatabase, basic_auth
import os

app = Flask(__name__)
driver = GraphDatabase.driver('neo4j+s://36954b0e.databases.neo4j.io',auth=basic_auth("neo4j",os.environ.get("NEO4J_AUTH_KEY")))
driver.verify_connectivity()

def serialize_user(user):
    return {
        "label": "user",
        "name": user.get("name")
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
    return null


if __name__ == "__main__":
    app.run(port=8080)