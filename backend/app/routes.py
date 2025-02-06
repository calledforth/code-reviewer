from flask import Blueprint, jsonify, request, Response, stream_with_context
import json
from app.services import GithubService

bp = Blueprint("api", __name__)


@bp.route("/review/init", methods=["POST"])
def init_review():
    try:
        if not request.form:
            return jsonify({"error": "No form data received"}), 400

        token = request.form.get("accessToken")
        github_url = request.form.get("githubUrl")
        guidelines = None

        if "guidelines" in request.files:
            pdf_file = request.files["guidelines"]
            if pdf_file and pdf_file.filename.endswith(".pdf"):
                try:
                    guidelines = pdf_file.read()
                except Exception as e:
                    print(f"Error reading PDF: {str(e)}")

        if not all([token, github_url]):
            return jsonify({"error": "Missing required fields"}), 400

        # Initialize GitHub service to validate credentials
        g = GithubService(token, github_url, guidelines)
        user_info = g.get_user()
        repo_info = g.fetch_repo()

        return (
            jsonify(
                {
                    "user_info": user_info,
                    "repo_info": repo_info,
                    "status": "initialized",
                    "has_guidelines": guidelines is not None,
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 401


@bp.route("/review/stream", methods=["GET"])
def stream_review():
    try:
        token = request.args.get("token")
        github_url = request.args.get("url")

        if not all([token, github_url]):
            return jsonify({"error": "Missing required query parameters"}), 400

        def generate():
            try:
                g = GithubService(token, github_url)
                yield f"data: {json.dumps({'type': 'status', 'message': 'Starting review...'})}\n\n"

                # First get and send all contents
                contents_result = g.extract_recursively_contents()
                yield f"data: {json.dumps({'type': 'contents', 'data': contents_result})}\n\n"

                # Then analyze each file
                for file_info in contents_result["contents"]:
                    # Notify starting analysis
                    yield f"""data: {json.dumps({
                        'type': 'analysis_start',
                        'file': file_info['name']
                    })}\n\n"""

                    # Perform analysis
                    analysis = g.get_file_analysis(file_info)
                    print(analysis)

                    # Send analysis results
                    yield f"""data: {json.dumps({
                        'type': 'analysis_complete',
                        'file': file_info['path'],
                        'analysis': analysis
                    })}\n\n"""

                yield f"data: {json.dumps({'type': 'status', 'message': 'Review completed'})}\n\n"

            except Exception as e:
                yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

        return Response(
            stream_with_context(generate()),
            mimetype="text/event-stream",
            headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 401
