import React, { useState } from 'react';
import { ArrowLeft, ThumbsUp, Flame, MessageCircle } from 'lucide-react';

const initialTopics = [
  {
    id: 1,
    title: 'How to optimize Apex triggers?',
    messages: [
      { id: 1, user: 'Alice', text: 'Bulkify your triggers and avoid SOQL in loops.', votes: 5 },
      { id: 2, user: 'Bob', text: 'Use handler classes for logic separation.', votes: 2 }
    ],
    trending: true
  },
  {
    id: 2,
    title: 'Best practices for LWC testing?',
    messages: [
      { id: 1, user: 'Charlie', text: 'Use Jest and write unit tests for all public methods.', votes: 7 }
    ],
    trending: false
  }
];

export const Discuss = ({ onBack, user, onProfile }) => {
  const [topics, setTopics] = useState(initialTopics);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [newTopic, setNewTopic] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [filter, setFilter] = useState('trending');

  const handleVote = (topicId, messageId) => {
    setTopics(topics => topics.map(topic =>
      topic.id === topicId ? {
        ...topic,
        messages: topic.messages.map(msg =>
          msg.id === messageId ? { ...msg, votes: msg.votes + 1 } : msg
        )
      } : topic
    ));
  };

  const handleAddTopic = () => {
    if (newTopic.trim()) {
      setTopics([
        ...topics,
        { id: Date.now(), title: newTopic, messages: [], trending: false }
      ]);
      setNewTopic('');
    }
  };

  const handleAddMessage = () => {
    if (newMessage.trim() && selectedTopic) {
      setTopics(topics => topics.map(topic =>
        topic.id === selectedTopic.id ? {
          ...topic,
          messages: [
            ...topic.messages,
            { id: Date.now(), user: 'You', text: newMessage, votes: 0 }
          ]
        } : topic
      ));
      setNewMessage('');
    }
  };

  const filteredTopics = filter === 'trending'
    ? topics.filter(t => t.trending)
    : topics;

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col p-0 m-0">
      <div className="flex-1 flex flex-col md:flex-row w-full h-full">
        {/* Sidebar for topics */}
        <div className="md:w-1/3 w-full bg-gray-800 p-6 overflow-y-auto h-full">
          <div className="flex items-center mb-6">
            <button onClick={onBack} className="p-2 bg-gray-700 rounded-lg mr-4">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold">Discuss & Collaborate</h1>
          </div>
          <div className="flex space-x-4 mb-6">
            <button
              className={`px-4 py-2 rounded ${filter === 'trending' ? 'bg-orange-500' : 'bg-gray-700'}`}
              onClick={() => setFilter('trending')}
            >
              <Flame size={16} className="inline mr-1" /> Trending
            </button>
            <button
              className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-orange-500' : 'bg-gray-700'}`}
              onClick={() => setFilter('all')}
            >
              <MessageCircle size={16} className="inline mr-1" /> All Topics
            </button>
          </div>
          <div className="mb-6">
            <input
              type="text"
              value={newTopic}
              onChange={e => setNewTopic(e.target.value)}
              placeholder="Start a new topic..."
              className="w-full p-3 rounded bg-gray-900 border border-gray-700 mb-2"
            />
            <button onClick={handleAddTopic} className="bg-orange-500 px-4 py-2 rounded w-full">Add</button>
          </div>
          <div className="space-y-4">
            {filteredTopics.length === 0 && <div className="text-gray-400">No topics yet.</div>}
            {filteredTopics.map(topic => (
              <div key={topic.id} className="bg-gray-900 p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-700" onClick={() => setSelectedTopic(topic)}>
                <div className="flex items-center">
                  {/* Show profile avatar if available */}
                  <div
                    className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold mr-3 cursor-pointer"
                    onClick={e => { e.stopPropagation(); onProfile && onProfile(topic.user); }}
                  >
                    {topic.user ? topic.user[0].toUpperCase() : <MessageCircle size={16} />}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{topic.title}</div>
                    <div className="text-gray-400 text-sm">{topic.messages.length} answers</div>
                  </div>
                </div>
                {topic.trending && <Flame className="text-orange-500" size={20} />}
              </div>
            ))}
          </div>
        </div>
        {/* Main chat area */}
        <div className="flex-1 flex flex-col bg-gray-950 p-6 overflow-y-auto h-full">
          {!selectedTopic ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <MessageCircle size={48} className="mb-4" />
              <div>Select a topic or start a new one to begin discussing!</div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <button onClick={() => setSelectedTopic(null)} className="mb-4 text-orange-400">&larr; Back to Topics</button>
              <div className="bg-gray-800 p-4 rounded-lg mb-4 flex items-center">
                {/* Show topic owner profile */}
                <div
                  className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold mr-3 cursor-pointer"
                  onClick={() => onProfile && onProfile(selectedTopic.user)}
                >
                  {selectedTopic.user ? selectedTopic.user[0].toUpperCase() : <MessageCircle size={20} />}
                </div>
                <div>
                  <div className="font-semibold text-lg mb-1">{selectedTopic.title}</div>
                  <div className="text-gray-400 text-xs">Shared by {selectedTopic.user || 'Anonymous'}</div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {selectedTopic.messages.length === 0 && <div className="text-gray-400">No answers yet. Be the first to reply!</div>}
                {selectedTopic.messages
                  .slice()
                  .sort((a, b) => b.votes - a.votes)
                  .map(msg => (
                  <div key={msg.id} className="bg-gray-900 p-3 rounded flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-2 cursor-pointer"
                        onClick={() => onProfile && onProfile(msg.user)}
                      >
                        {msg.user ? msg.user[0].toUpperCase() : <MessageCircle size={16} />}
                      </div>
                      <span className="font-medium text-orange-400 mr-2 cursor-pointer" onClick={() => onProfile && onProfile(msg.user)}>{msg.user}:</span>
                      <span>{msg.text}</span>
                    </div>
                    <button onClick={() => handleVote(selectedTopic.id, msg.id)} className="flex items-center space-x-1 text-green-400">
                      <ThumbsUp size={16} />
                      <span>{msg.votes}</span>
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex mt-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type your answer..."
                  className="flex-1 p-3 rounded bg-gray-800 border border-gray-700 mr-2"
                />
                <button onClick={handleAddMessage} className="bg-orange-500 px-4 py-2 rounded">Send</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
