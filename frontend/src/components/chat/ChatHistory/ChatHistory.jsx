import React from 'react';

const sampleChats = [
  {
    id: '1',
    title: 'Physics Concepts',
    lastMessage: 'Can you explain Newton\'s laws?',
    timestamp: new Date('2023-10-01T14:30:00'),
    document: 'Physics Textbook.pdf'
  },
  {
    id: '2',
    title: 'Math Help',
    lastMessage: 'Help with calculus problems',
    timestamp: new Date('2023-10-02T10:15:00'),
    document: 'Mathematics.pdf'
  },
  {
    id: '3',
    title: 'Chemistry Questions',
    lastMessage: 'Periodic table discussion',
    timestamp: new Date('2023-10-03T16:45:00'),
    document: 'Chemistry Notes.pdf'
  }
];

export const ChatHistory = ({ 
  chats = sampleChats, 
  activeChatId, 
  onChatSelect,
  onNewChat 
}) => {
  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Chats</h2>
          <button
            onClick={onNewChat}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onChatSelect(chat.id)}
            className={`
              p-4 border-b border-gray-100 cursor-pointer transition-colors
              ${activeChatId === chat.id 
                ? 'bg-blue-50 border-blue-200' 
                : 'hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 text-sm">💬</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {chat.title}
                </h3>
                <p className="text-sm text-gray-600 truncate mt-1">
                  {chat.lastMessage}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {chat.document}
                  </span>
                  <span className="text-xs text-gray-500">
                    {chat.timestamp.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {chats.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No chats yet</h3>
            <p className="text-gray-600 mb-4">Start a new conversation with your AI tutor</p>
            <button
              onClick={onNewChat}
              className="btn-primary"
            >
              Start New Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};