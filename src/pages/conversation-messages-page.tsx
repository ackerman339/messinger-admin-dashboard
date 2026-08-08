import { useParams } from 'react-router-dom';

export function ConversationMessagesPage() {
  const { userId, conversationId } = useParams();

  return (
    <div>
      <h1>Mensajes</h1>

      <p>Usuario: {userId}</p>
      <p>Conversación: {conversationId}</p>
    </div>
  );
}
