'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Link as LinkIcon,
  Image as ImageIcon,
  FileText,
  Upload,
  Loader2,
  Globe,
  Trash2,
  Plus,
  Folder,
  Tag,
  Star,
  Check,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Resource, Category, LinkPreview, ResourceType } from '@/types';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (resource: Partial<Resource>) => void;
  categories: Category[];
  onAddCategory: (name: string, color: string) => void;
  editingResource?: Resource | null;
}

const resourceTypes: { type: ResourceType; label: string; icon: typeof LinkIcon; color: string }[] = [
  { type: 'link', label: 'Link', icon: LinkIcon, color: 'bg-blue-500' },
  { type: 'image', label: 'Image', icon: ImageIcon, color: 'bg-purple-500' },
  { type: 'note', label: 'Note', icon: FileText, color: 'bg-amber-500' },
];

const defaultColors = [
  '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#14b8a6',
];

export default function AddResourceModal({
  isOpen,
  onClose,
  onSave,
  categories,
  onAddCategory,
  editingResource,
}: AddResourceModalProps) {
  const [type, setType] = useState<ResourceType>('link');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [siteName, setSiteName] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingPreview, setIsFetchingPreview] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#ec4899');
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (editingResource) {
        setType(editingResource.type);
        setTitle(editingResource.title);
        setUrl(editingResource.url || '');
        setContent(editingResource.content || '');
        setDescription(editingResource.description || '');
        setThumbnail(editingResource.thumbnail || '');
        setSiteName(editingResource.siteName || '');
        setCategory(editingResource.category || '');
        setTags(editingResource.tags || []);
        setIsFavorite(editingResource.isFavorite);
        if (editingResource.type === 'image' && editingResource.url) {
          setImagePreview(editingResource.url);
        }
      } else {
        resetForm();
      }
    }
  }, [isOpen, editingResource]);

  const resetForm = () => {
    setType('link');
    setTitle('');
    setUrl('');
    setContent('');
    setDescription('');
    setThumbnail('');
    setSiteName('');
    setCategory('');
    setTags([]);
    setTagInput('');
    setIsFavorite(false);
    setImagePreview(null);
  };

  // Fetch link preview with debounce
  const fetchLinkPreview = useCallback(async (linkUrl: string) => {
    if (!linkUrl || !linkUrl.startsWith('http')) return;

    setIsFetchingPreview(true);
    try {
      const response = await fetch('/api/link-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: linkUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        const preview: LinkPreview = data.preview;
        
        if (!title && preview.title) setTitle(preview.title);
        if (preview.description) setDescription(preview.description);
        if (preview.thumbnail) setThumbnail(preview.thumbnail);
        if (preview.siteName) setSiteName(preview.siteName);
      }
    } catch (error) {
      console.error('Error fetching link preview:', error);
    } finally {
      setIsFetchingPreview(false);
    }
  }, [title]);

  // Handle URL change with debounce
  const handleUrlChange = (value: string) => {
    setUrl(value);
    
    if (type === 'link' && value.startsWith('http')) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        fetchLinkPreview(value);
      }, 800);
    }
  };

  // Handle image upload
  const uploadImage = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUrl(data.url);
        setImagePreview(data.url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      uploadImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      uploadImage(file);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim(), newCategoryColor);
      setNewCategoryName('');
      setShowNewCategory(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      const resourceData: Partial<Resource> = {
        type,
        title: title.trim(),
        url: url || undefined,
        content: content || undefined,
        description: description || undefined,
        thumbnail: thumbnail || undefined,
        siteName: siteName || undefined,
        category: category || undefined,
        tags,
        isFavorite,
      };

      await onSave(resourceData);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">
              {editingResource ? 'Edit Resource' : 'Add Resource'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Resource Type Selector */}
            {!editingResource && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {resourceTypes.map((rt) => (
                    <button
                      key={rt.type}
                      type="button"
                      onClick={() => setType(rt.type)}
                      className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        type === rt.type
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`p-2 rounded-lg text-white ${rt.color}`}>
                        <rt.icon className="w-5 h-5" />
                      </div>
                      <span className={`font-medium ${type === rt.type ? 'text-pink-600' : 'text-gray-700'}`}>
                        {rt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* URL Input for Links */}
            {type === 'link' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    ref={urlInputRef}
                    type="url"
                    value={url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://example.com/article"
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  {isFetchingPreview && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500 animate-spin" />
                  )}
                </div>
              </div>
            )}

            {/* Link Preview Card */}
            {type === 'link' && (thumbnail || siteName) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-xl p-4 border border-gray-200"
              >
                <div className="flex gap-4">
                  {thumbnail && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumbnail}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => setThumbnail('')}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {siteName && (
                      <span className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                        <Globe className="w-3 h-3" />
                        {siteName}
                      </span>
                    )}
                    <h4 className="font-medium text-gray-900 line-clamp-2">
                      {title || 'Preview title will appear here'}
                    </h4>
                    {description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Image Upload */}
            {type === 'image' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {!imagePreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-pink-400 hover:bg-pink-50/50 transition-all"
                  >
                    <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600 font-medium">
                      Click or drag image to upload
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setUrl('');
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="mt-3">
                  <p className="text-sm text-gray-500 mb-2">Or paste image URL:</p>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Title */}
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title"
              required
            />

            {/* Content for Notes */}
            {type === 'note' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your notes here..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                />
              </div>
            )}

            {/* Description for Links */}
            {type === 'link' && (
              <Input
                label="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description"
              />
            )}

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors text-left"
                >
                  <span className="flex items-center gap-2">
                    <Folder className="w-5 h-5 text-gray-400" />
                    {category ? (
                      <span
                        className="px-2 py-0.5 rounded-full text-sm"
                        style={{
                          backgroundColor: `${categories.find(c => c._id === category)?.color}20`,
                          color: categories.find(c => c._id === category)?.color,
                        }}
                      >
                        {categories.find(c => c._id === category)?.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">Select category</span>
                    )}
                  </span>
                </button>

                {showCategoryDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowCategoryDropdown(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20 max-h-60 overflow-y-auto"
                    >
                      <button
                        onClick={() => {
                          setCategory('');
                          setShowCategoryDropdown(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-gray-500 hover:bg-gray-50"
                      >
                        No category
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat._id}
                          onClick={() => {
                            setCategory(cat._id);
                            setShowCategoryDropdown(false);
                          }}
                          className={`w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 ${
                            category === cat._id ? 'bg-pink-50' : ''
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span>{cat.name}</span>
                          {category === cat._id && (
                            <Check className="w-4 h-4 ml-auto text-pink-500" />
                          )}
                        </button>
                      ))}
                      <hr className="my-2 border-gray-100" />
                      {!showNewCategory ? (
                        <button
                          onClick={() => setShowNewCategory(true)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-pink-600 hover:bg-pink-50"
                        >
                          <Plus className="w-4 h-4" />
                          Add new category
                        </button>
                      ) : (
                        <div className="px-4 py-2 space-y-2">
                          <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Category name"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
                            autoFocus
                          />
                          <div className="flex gap-1">
                            {defaultColors.map((color) => (
                              <button
                                key={color}
                                onClick={() => setNewCategoryColor(color)}
                                className={`w-6 h-6 rounded-full ${
                                  newCategoryColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setShowNewCategory(false)}
                              className="flex-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleAddCategory}
                              className="flex-1 px-3 py-1.5 text-sm bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="p-0.5 hover:bg-gray-200 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add a tag"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Favorite Toggle */}
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                isFavorite
                  ? 'border-pink-500 bg-pink-50 text-pink-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              <span className="font-medium">Mark as favorite</span>
            </button>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!title.trim() || isLoading || isUploading}
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : editingResource ? (
                'Save Changes'
              ) : (
                'Add Resource'
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
