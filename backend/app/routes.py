from flask import Blueprint, jsonify, request
from app.services import GithubService

bp = Blueprint("api", __name__)


@bp.route("/review", methods=["POST"])
def review():
    if not request.form:
        return jsonify({"error": "No form data received"}), 400
    data = request.form
    g = GithubService(data["username"], data["password"])
    print(g.get_user())
    return jsonify({"message": "Reviewing user"}), 200
