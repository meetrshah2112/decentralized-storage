from flask import Flask, jsonify, request, Response
from config import AGENT_HOST, AGENT_PORT

from ipfs_client import (
    ipfs_available,
    get_peer_id,
    get_version,
    add_file_to_ipfs,
    get_file_from_ipfs,
)

app = Flask(__name__)


@app.route("/health/", methods=["GET"])
def health():
    return jsonify(
        {
            "success": True,
            "message": "Node Agent is running.",
            "ipfs_status": ipfs_available(),
            "ipfs_peer_id": get_peer_id(),
            "ipfs_version": get_version(),
        }
    )


@app.route("/upload/", methods=["POST"])
def upload():
    if "file" not in request.files:
        return (
            jsonify(
                {
                    "success": False,
                    "message": "No file provided.",
                }
            ),
            400,
        )

    uploaded_file = request.files["file"]

    try:
        ipfs_result = add_file_to_ipfs(uploaded_file)

        return jsonify(
            {
                "success": True,
                "message": "File uploaded to provider IPFS.",
                "cid": ipfs_result["Hash"],
                "name": ipfs_result.get("Name", uploaded_file.filename),
                "size": ipfs_result.get("Size"),
            }
        )

    except Exception as error:
        return (
            jsonify(
                {
                    "success": False,
                    "message": str(error),
                }
            ),
            500,
        )


@app.route("/download/", methods=["GET"])
def download():
    cid = request.args.get("cid")

    if not cid:
        return (
            jsonify(
                {
                    "success": False,
                    "message": "CID is required.",
                }
            ),
            400,
        )

    try:
        file_content = get_file_from_ipfs(cid)

        return Response(
            file_content,
            mimetype="application/octet-stream",
        )

    except Exception as error:
        return (
            jsonify(
                {
                    "success": False,
                    "message": str(error),
                }
            ),
            500,
        )


def run_upload_server():
    app.run(
        host=AGENT_HOST,
        port=AGENT_PORT,
        debug=False,
        use_reloader=False,
    )
