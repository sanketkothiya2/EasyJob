'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Grid,
  List,
  Star,
  Link as LinkIcon,
  Image as ImageIcon,
  FileText,
  Folder,
  Loader2,
  Trash2,
  BookOpen,
  Briefcase,
  X,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import ResourceCard from '@/components/resources/ResourceCard';
import AddResourceModal from '@/components/resources/AddResourceModal';
import { Resource, Category, ResourceType } from '@/types';

const typeFilters: { type: ResourceType | 'all'; label: string; icon: typeof LinkIcon }[] = [
  { type: 'all', label: 'All', icon: BookOpen },
  { type: 'link', label: 'Links', icon: LinkIcon },
  { type: 'image', label: 'Images', icon: ImageIcon },
  { type: 'note', label: 'Notes', icon: FileText },
];

export default function ResourcesPage() {
  const { data: session, status } = useSession();
  
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch resources and categories
  useEffect(() => {
    if (session?.user?.id) {
      fetchResources();
      fetchCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  const fetchResources = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedType !== 'all') params.append('type', selectedType);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (showFavorites) params.append('favorite', 'true');
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/resources?${params}`);
      const data = await response.json();
      if (data.resources) {
        setResources(data.resources);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Re-fetch when filters change
  useEffect(() => {
    if (session?.user?.id) {
      fetchResources();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, selectedCategory, showFavorites, searchQuery]);

  const handleSaveResource = async (resourceData: Partial<Resource>) => {
    try {
      if (editingResource) {
        // Update existing
        const response = await fetch(`/api/resources/${editingResource._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resourceData),
        });
        if (response.ok) {
          fetchResources();
        }
      } else {
        // Create new
        const response = await fetch('/api/resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resourceData),
        });
        if (response.ok) {
          fetchResources();
        }
      }
    } catch (error) {
      console.error('Error saving resource:', error);
    }
    setEditingResource(null);
    setIsModalOpen(false);
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setResources(resources.filter(r => r._id !== id));
        if (selectedResource?._id === id) {
          setSelectedResource(null);
        }
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite }),
      });
      if (response.ok) {
        setResources(resources.map(r => 
          r._id === id ? { ...r, isFavorite } : r
        ));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleAddCategory = async (name: string, color: string) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color }),
      });
      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category? Resources will be uncategorized.')) return;
    
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchCategories();
        fetchResources();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setIsModalOpen(true);
  };

  const handleResourceClick = (resource: Resource) => {
    if (resource.type === 'link' && resource.url) {
      window.open(resource.url, '_blank');
    } else {
      setSelectedResource(resource);
    }
  };

  // Stats
  const stats = {
    total: resources.length,
    links: resources.filter(r => r.type === 'link').length,
    images: resources.filter(r => r.type === 'image').length,
    notes: resources.filter(r => r.type === 'note').length,
    favorites: resources.filter(r => r.isFavorite).length,
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src="/images/logo/logo.png"
                alt="EasyJob"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="font-bold text-xl bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
                EasyJob
              </span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden lg:flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-gray-600 hover:text-pink-600 hover:bg-white/50 transition-colors"
              >
                <Briefcase className="w-4 h-4" />
                Jobs
              </Link>
              <Link
                href="/resources"
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-white text-pink-600 shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
                Resources
              </Link>
            </nav>

            {/* Add Resource Button */}
            <Button
              onClick={() => {
                setEditingResource(null);
                setIsModalOpen(true);
              }}
              className="ml-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Resource
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Total', value: stats.total, icon: BookOpen, color: 'from-pink-500 to-rose-500' },
            { label: 'Links', value: stats.links, icon: LinkIcon, color: 'from-blue-500 to-cyan-500' },
            { label: 'Images', value: stats.images, icon: ImageIcon, color: 'from-purple-500 to-violet-500' },
            { label: 'Notes', value: stats.notes, icon: FileText, color: 'from-amber-500 to-orange-500' },
            { label: 'Favorites', value: stats.favorites, icon: Star, color: 'from-pink-500 to-red-500' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -2 }}
              className="bg-white rounded-xl p-4 shadow-soft border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Mobile Search - hidden on desktop since header has search */}
            <div className="relative flex-1 md:hidden">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div className="flex gap-2 flex-wrap">
              {typeFilters.map((filter) => (
                <button
                  key={filter.type}
                  onClick={() => setSelectedType(filter.type)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                    selectedType === filter.type
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <filter.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{filter.label}</span>
                </button>
              ))}
            </div>

            {/* Favorites Toggle */}
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                showFavorites
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Star className={`w-4 h-4 ${showFavorites ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">Favorites</span>
            </button>

            {/* View Mode */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 custom-scrollbar-thin">
            <span className="text-sm text-gray-500 flex-shrink-0">Categories:</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat._id
                    ? 'text-white'
                    : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: selectedCategory === cat._id ? cat.color : `${cat.color}20`,
                  color: selectedCategory === cat._id ? 'white' : cat.color,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: selectedCategory === cat._id ? 'white' : cat.color }}
                />
                {cat.name}
                {selectedCategory === cat._id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(cat._id);
                    }}
                    className="ml-1 p-0.5 hover:bg-white/20 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        {resources.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-soft border border-gray-100 p-12 text-center"
          >
            <div className="w-20 h-20 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-pink-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No resources yet
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">
              Start building your resource library by adding links, images, or notes.
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Resource
            </Button>
          </motion.div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}
          >
            <AnimatePresence mode="popLayout">
              {resources.map((resource) => (
                <ResourceCard
                  key={resource._id}
                  resource={resource}
                  onEdit={handleEditResource}
                  onDelete={handleDeleteResource}
                  onToggleFavorite={handleToggleFavorite}
                  onClick={handleResourceClick}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AddResourceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingResource(null);
        }}
        onSave={handleSaveResource}
        categories={categories}
        onAddCategory={handleAddCategory}
        editingResource={editingResource}
      />

      {/* Resource Detail Modal */}
      <AnimatePresence>
        {selectedResource && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedResource(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
            >
              {/* Image Preview */}
              {selectedResource.type === 'image' && selectedResource.url && (
                <div className="relative bg-gray-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedResource.url}
                    alt={selectedResource.title}
                    className="w-full max-h-[60vh] object-contain"
                  />
                  <button
                    onClick={() => setSelectedResource(null)}
                    className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Note Content */}
              {selectedResource.type === 'note' && (
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedResource.title}
                    </h2>
                    <button
                      onClick={() => setSelectedResource(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {selectedResource.categoryData && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mb-4"
                      style={{
                        backgroundColor: `${selectedResource.categoryData.color}20`,
                        color: selectedResource.categoryData.color,
                      }}
                    >
                      <Folder className="w-3 h-3" />
                      {selectedResource.categoryData.name}
                    </span>
                  )}
                  <div className="prose prose-pink max-w-none">
                    <p className="whitespace-pre-wrap text-gray-600">
                      {selectedResource.content}
                    </p>
                  </div>
                  {selectedResource.tags && selectedResource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-100">
                      {selectedResource.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 p-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleEditResource(selectedResource);
                    setSelectedResource(null);
                  }}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleDeleteResource(selectedResource._id);
                    setSelectedResource(null);
                  }}
                  className="flex-1 text-red-500 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
