import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Badge } from '@/components/UI/badge';
import { Input } from '@/components/UI/input';
import { Filter, X, ChevronDown, ChevronUp, Search, Star, Clock, Target } from 'lucide-react';

interface FilterState {
  difficulty: string[];
  category: string[];
  tags: string[];
  companies: string[];
  status: string[];
  timeComplexity: string[];
  spaceComplexity: string[];
}

interface EnhancedFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
}

const difficulties = ['Easy', 'Medium', 'Hard'];
const categories = [
  'Arrays', 'Data Structures', 'Algorithms', 'Database', 'System Design',
  'Programming Concepts', 'Networking', 'Operating Systems', 'Web Development',
  'Machine Learning', 'Cloud Computing', 'Mobile Development'
];
const tags = [
  'Two Pointers', 'Sliding Window', 'Binary Search', 'Hash Table', 'Sorting',
  'Dynamic Programming', 'Greedy', 'Backtracking', 'Divide and Conquer',
  'Stack', 'Queue', 'Linked List', 'Tree', 'Graph', 'Trie', 'Heap',
  'Recursion', 'Bit Manipulation', 'Math', 'String', 'Matrix'
];
const companies = [
  'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix',
  'Uber', 'LinkedIn', 'Twitter', 'Airbnb', 'Spotify', 'Tesla',
  'Oracle', 'IBM', 'Adobe', 'Salesforce', 'Dropbox', 'Slack'
];
const statusOptions = ['Solved', 'Attempted', 'Unsolved', 'Bookmarked'];
const timeComplexities = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'];
const spaceComplexities = ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'];

export default function EnhancedFilters({ filters, onFiltersChange, onReset }: EnhancedFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['difficulty', 'category']);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleFilterChange = (category: keyof FilterState, value: string, checked: boolean) => {
    const currentFilters = { ...filters };
    if (checked) {
      currentFilters[category] = [...currentFilters[category], value];
    } else {
      currentFilters[category] = currentFilters[category].filter(item => item !== value);
    }
    onFiltersChange(currentFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).reduce((count, filterArray) => count + filterArray.length, 0);
  };

  const FilterSection = ({ 
    title, 
    sectionKey, 
    items, 
    icon: Icon,
    maxItems = 10 
  }: {
    title: string;
    sectionKey: keyof FilterState;
    items: string[];
    icon?: any;
    maxItems?: number;
  }) => {
    const isExpanded = expandedSections.includes(sectionKey);
    const displayItems = isExpanded ? items : items.slice(0, maxItems);

    return (
      <div className="border-b border-gray-200 dark:border-gray-700 last:border-0">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-gray-500" />}
            <span className="font-medium text-sm text-gray-900 dark:text-white">{title}</span>
            {filters[sectionKey].length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {filters[sectionKey].length}
              </Badge>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {isExpanded && (
          <div className="px-3 pb-3 space-y-2">
            {displayItems.map((item) => (
              <label key={item} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded">
                <input
                  type="checkbox"
                  checked={filters[sectionKey].includes(item)}
                  onChange={(e) => handleFilterChange(sectionKey, item, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
              </label>
            ))}
            {items.length > maxItems && (
              <div className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                {items.length - maxItems} more items...
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-80 h-fit sticky top-20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <CardTitle className="text-lg">Filters</CardTitle>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="text-xs">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs"
            disabled={getActiveFiltersCount() === 0}
          >
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Search */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search filters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 text-sm"
            />
          </div>
        </div>

        {/* Quick Filters */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('difficulty', 'Easy', !filters.difficulty.includes('Easy'))}
              className={`text-xs ${filters.difficulty.includes('Easy') ? 'bg-green-100 border-green-300 text-green-700' : ''}`}
            >
              Easy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('difficulty', 'Medium', !filters.difficulty.includes('Medium'))}
              className={`text-xs ${filters.difficulty.includes('Medium') ? 'bg-yellow-100 border-yellow-300 text-yellow-700' : ''}`}
            >
              Medium
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('difficulty', 'Hard', !filters.difficulty.includes('Hard'))}
              className={`text-xs ${filters.difficulty.includes('Hard') ? 'bg-red-100 border-red-300 text-red-700' : ''}`}
            >
              Hard
            </Button>
          </div>
        </div>

        {/* Filter Sections */}
        <FilterSection
          title="Difficulty"
          sectionKey="difficulty"
          items={difficulties}
          icon={Target}
        />

        <FilterSection
          title="Category"
          sectionKey="category"
          items={categories}
          icon={Star}
          maxItems={6}
        />

        <FilterSection
          title="Tags"
          sectionKey="tags"
          items={tags.filter(tag => 
            searchTerm === '' || tag.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          icon={Target}
          maxItems={8}
        />

        <FilterSection
          title="Companies"
          sectionKey="companies"
          items={companies.filter(company => 
            searchTerm === '' || company.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          icon={Star}
          maxItems={6}
        />

        <FilterSection
          title="Status"
          sectionKey="status"
          items={statusOptions}
          icon={Clock}
        />

        <FilterSection
          title="Time Complexity"
          sectionKey="timeComplexity"
          items={timeComplexities}
          icon={Clock}
        />

        <FilterSection
          title="Space Complexity"
          sectionKey="spaceComplexity"
          items={spaceComplexities}
          icon={Target}
        />
      </CardContent>
    </Card>
  );
}
