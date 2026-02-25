'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Link as LinkIcon,
  Image as ImageIcon,
  FileText,
  Star,
  MoreVertical,
  Trash2,
  Edit2,
  Copy,
  Folder,
} from 'lucide-react';
import { Resource } from '@/types';
import { formatDate } from '@/lib/utils';

interface ResourceCardProps {
  resource: Resource;
  onEdit: (resource: Resource) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onClick: (resource: Resource) => void;
}

export default function ResourceCard({
  resource,
  onEdit,
  onDelete,
  onToggleFavorite,
  onClick,
}: ResourceCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getTypeIcon = () => {
    switch (resource.type) {
      case 'link':
        return <LinkIcon className="w-4 h-4" />;
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'note':
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = () => {
    switch (resource.type) {
      case 'link':
        return 'bg-blue-100 text-blue-600';
      case 'image':
        return 'bg-purple-100 text-purple-600';
      case 'note':
        return 'bg-amber-100 text-amber-600';
    }
  };

  const handleCopyUrl = async () => {
    if (resource.url) {
      await navigator.clipboard.writeText(resource.url);
    }
    setShowMenu(false);
  };

  const getThumbnailUrl = () => {
    if (resource.type === 'image' && resource.url) {
      return resource.url;
    }
    if (resource.thumbnail) {
      return resource.thumbnail;
    }
    return null;
  };

  const thumbnailUrl = getThumbnailUrl();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
      onClick={() => onClick(resource)}
    >
      {/* Thumbnail Section - YouTube Style */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
        {thumbnailUrl && !imageError ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnailUrl}
              alt={resource.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className={`p-6 rounded-2xl ${getTypeColor()}`}>
              {resource.type === 'link' && <LinkIcon className="w-12 h-12" />}
              {resource.type === 'image' && <ImageIcon className="w-12 h-12" />}
              {resource.type === 'note' && <FileText className="w-12 h-12" />}
            </div>
          </div>
        )}

        {/* Type Badge */}
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 ${getTypeColor()} backdrop-blur-sm`}>
          {getTypeIcon()}
          <span className="capitalize">{resource.type}</span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(resource._id, !resource.isFavorite);
          }}
          className={`absolute top-3 right-3 p-2 rounded-lg transition-all ${
            resource.isFavorite
              ? 'bg-pink-500 text-white'
              : 'bg-white/80 text-gray-400 hover:text-pink-500 opacity-0 group-hover:opacity-100'
          }`}
        >
          <Star className={`w-4 h-4 ${resource.isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* External Link Icon for links */}
        {resource.type === 'link' && resource.url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-3 right-3 p-2 bg-white/90 rounded-lg text-gray-500 hover:text-pink-500 opacity-0 group-hover:opacity-100 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Category & Site Info */}
        <div className="flex items-center gap-2 mb-2">
          {resource.categoryData && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${resource.categoryData.color}20`,
                color: resource.categoryData.color,
              }}
            >
              <Folder className="w-3 h-3" />
              {resource.categoryData.name}
            </span>
          )}
          {resource.siteName && resource.type === 'link' && (
            <span className="text-xs text-gray-400 truncate">
              {resource.siteName}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-1.5 line-clamp-2 group-hover:text-pink-600 transition-colors">
          {resource.title}
        </h3>

        {/* Description/Content Preview */}
        {(resource.description || resource.content) && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {resource.description || resource.content}
          </p>
        )}

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs"
              >
                #{tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className="px-2 py-0.5 text-gray-400 text-xs">
                +{resource.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="text-xs text-gray-400">
            {formatDate(resource.createdAt)}
          </span>

          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-0 bottom-full mb-1 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(resource);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  {resource.url && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUrl();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Copy className="w-4 h-4" />
                      Copy URL
                    </button>
                  )}
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(resource._id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
