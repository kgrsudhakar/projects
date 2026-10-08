from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """
    Full CRUD API for Task.

    Supports:
      GET    /api/tasks/            list (with ?status=, ?priority=, ?search=)
      POST   /api/tasks/            create
      GET    /api/tasks/{id}/       retrieve
      PUT    /api/tasks/{id}/       full update
      PATCH  /api/tasks/{id}/       partial update
      DELETE /api/tasks/{id}/       delete
    """

    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "priority"]
    search_fields = ["title", "description"]
    ordering_fields = ["created_at", "due_date", "priority"]
