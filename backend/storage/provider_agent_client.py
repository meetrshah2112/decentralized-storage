import requests


def upload_file_to_provider(provider_node, file_obj, filename):
    if not provider_node.agent_api_url:
        raise Exception("Selected provider node does not have an agent API URL.")

    upload_url = f"{provider_node.agent_api_url.rstrip('/')}/upload/"

    try:
        files = {
            "file": (
                filename,
                file_obj,
            )
        }

        data = {
            "node_uuid": str(provider_node.node_uuid),
        }

        response = requests.post(
            upload_url,
            files=files,
            data=data,
            timeout=120,
        )

        response.raise_for_status()

        result = response.json()

        if not result.get("success"):
            raise Exception(result.get("message", "Provider upload failed."))

        return result

    except requests.RequestException as error:
        raise Exception(f"Provider Agent upload failed: {error}")
