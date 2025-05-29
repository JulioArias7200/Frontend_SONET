import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface User {
  _id: string;
  username: string;
  email: string;
  profile_pic_url?: string;
  bio?: string;
}

interface UserSearchBoxProps {
  users: User[];
}

export function UserSearchBox({ users }: UserSearchBoxProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredUsers);
      setIsDropdownVisible(true);
    } else {
      setSearchResults([]);
      setIsDropdownVisible(false);
    }
  }, [searchQuery, users]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative mb-4" ref={dropdownRef}>
      <Input
        type="text"
        placeholder="Buscar usuarios..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-purple-900/30 border-purple-500/30 text-white placeholder-gray-400"
      />
      
      {isDropdownVisible && searchResults.length > 0 && (
        <div className="absolute w-full mt-1 max-h-60 overflow-y-auto bg-purple-900/95 border border-purple-500/30 rounded-md shadow-lg z-50">
          {searchResults.map((user) => (
            <Card key={user._id} className="p-2 m-1 bg-purple-900/30 border-purple-500/30 hover:bg-purple-800/40 transition-colors">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border border-purple-500/50">
                  <AvatarImage
                    src={user.profile_pic_url || "https://via.placeholder.com/32"}
                    alt={user.username}
                  />
                  <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.username}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}