from django.urls import path

from . import api_views


urlpatterns = [

    # ========================================================
    # AUTH
    # ========================================================

    path(
        "auth/register/",
        api_views.api_register,
        name="api_register",
    ),

    path(
        "auth/login/",
        api_views.api_login,
        name="api_login",
    ),

    path(
        "auth/logout/",
        api_views.api_logout,
        name="api_logout",
    ),

    path(
        "auth/me/",
        api_views.api_me,
        name="api_me",
    ),


    # ========================================================
    # FILES
    # ========================================================

    path(
        "files/",
        api_views.api_file_list,
        name="api_file_list",
    ),

    path(
        "files/upload/",
        api_views.api_file_upload,
        name="api_file_upload",
    ),

    path(
        "files/<int:file_id>/",
        api_views.api_file_detail,
        name="api_file_detail",
    ),

    path(
        "files/<int:file_id>/download/",
        api_views.api_file_download,
        name="api_file_download",
    ),

    path(
        "files/<int:file_id>/view/",
        api_views.api_file_view,
        name="api_file_view",
    ),

    path(
        "files/<int:file_id>/delete/",
        api_views.api_file_delete,
        name="api_file_delete",
    ),


    # ========================================================
    # PROVIDER
    # ========================================================

    path(
        "become-provider/",
        api_views.api_become_provider,
        name="api_become_provider",
    ),

    path(
        "provider/node/",
        api_views.api_provider_node,
        name="api_provider_node",
    ),

    path(
        "provider/node/register/",
        api_views.api_provider_node_register,
        name="api_provider_node_register",
    ),


    # ========================================================
    # NETWORK
    # ========================================================

    path(
        "network/stats/",
        api_views.api_network_stats,
        name="api_network_stats",
    ),


    # ========================================================
    # ADMIN
    # ========================================================

    path(
        "admin/stats/",
        api_views.api_admin_stats,
        name="api_admin_stats",
    ),
]