from django.db import migrations, models
import storage.models


def generate_tokens(apps, schema_editor):
    StorageNode = apps.get_model("storage", "StorageNode")

    for node in StorageNode.objects.all():
        if not node.node_token:
            node.node_token = storage.models.generate_node_token()
            node.save(
                update_fields=["node_token"]
            )


class Migration(migrations.Migration):

    dependencies = [
        ("storage", "0008_storagenode_node_token"),
    ]

    operations = [
        migrations.RunPython(
            generate_tokens,
            migrations.RunPython.noop,
        ),

        migrations.AlterField(
            model_name="storagenode",
            name="node_token",
            field=models.CharField(
                max_length=128,
                unique=True,
                editable=False,
            ),
        ),
    ]