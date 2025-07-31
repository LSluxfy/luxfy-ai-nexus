import React, { useState, useRef, useEffect } from 'react';
import { X, Tag, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TagAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddTag: () => void;
  selectedTags: string[];
  onRemoveTag: (tag: string) => void;
  suggestions: string[];
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export const TagAutocomplete = ({
  value,
  onChange,
  onAddTag,
  selectedTags,
  onRemoveTag,
  suggestions,
  isLoading = false,
  placeholder = "Adicionar tag",
  className
}: TagAutocompleteProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filtrar sugestões baseado no valor atual
  const filteredSuggestions = suggestions.filter(
    suggestion => 
      suggestion.toLowerCase().includes(value.toLowerCase()) &&
      !selectedTags.includes(suggestion) &&
      suggestion !== value
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setShowSuggestions(true);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && filteredSuggestions[focusedIndex]) {
        onChange(filteredSuggestions[focusedIndex]);
        onAddTag();
      } else {
        onAddTag();
      }
      setShowSuggestions(false);
      setFocusedIndex(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setFocusedIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    onAddTag();
    setShowSuggestions(false);
    setFocusedIndex(-1);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Delay para permitir clique nas sugestões
    setTimeout(() => setShowSuggestions(false), 150);
  };

  // Atualizar valor quando focusedIndex muda
  useEffect(() => {
    if (focusedIndex >= 0 && filteredSuggestions[focusedIndex]) {
      onChange(filteredSuggestions[focusedIndex]);
    }
  }, [focusedIndex, filteredSuggestions]);

  return (
    <div className={cn("space-y-2", className)}>
      {/* Input com sugestões */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder={placeholder}
              className="pr-8"
            />
            {isLoading && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            )}
            
            {/* Dropdown de sugestões */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto"
              >
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2",
                      index === focusedIndex && "bg-gray-50"
                    )}
                  >
                    <Tag className="h-3 w-3 text-gray-400" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <Button 
            type="button" 
            onClick={onAddTag} 
            variant="outline"
            disabled={!value.trim()}
          >
            Adicionar
          </Button>
        </div>
        
        {/* Barra de carregamento */}
        {isLoading && (
          <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Carregando sugestões...
          </div>
        )}
      </div>

      {/* Tags selecionadas */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-500" 
                onClick={() => onRemoveTag(tag)} 
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};