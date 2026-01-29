from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ChatSession, ChatMessage
from .serializers import ChatSessionSerializer, ChatMessageSerializer, ChatInputSerializer
from .utils import get_ai_advisor_response

class ChatbotViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ChatSessionSerializer

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def ask(self, request):
        serializer = ChatInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user_message = serializer.validated_data['message']
        session_id = serializer.validated_data.get('session_id')

        if session_id:
            try:
                session = ChatSession.objects.get(id=session_id, user=request.user)
            except ChatSession.DoesNotExist:
                return Response({"detail": "Chat session not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Create a new session if none provided
            # Limit title to first 50 chars of first message
            title = user_message[:50] + ("..." if len(user_message) > 50 else "")
            session = ChatSession.objects.create(user=request.user, title=title)

        # 1. Get chat history for context (last 10 messages BEFORE this one)
        history_objs = session.messages.all().order_by('-created_at')[:10]
        history = [{"role": msg.role, "content": msg.content} for msg in reversed(history_objs)]

        # 2. Save user message
        ChatMessage.objects.create(
            session=session,
            role='user',
            content=user_message
        )

        # 3. Get AI response
        ai_response = get_ai_advisor_response(request.user, user_message, history)

        # 4. Save AI message
        ai_msg = ChatMessage.objects.create(
            session=session,
            role='assistant',
            content=ai_response
        )

        # 5. Return response
        return Response({
            "session_id": session.id,
            "message": ChatMessageSerializer(ai_msg).data
        }, status=status.HTTP_200_OK)
