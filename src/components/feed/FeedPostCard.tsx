'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Heart,
    MessageCircle,
    Pencil,
    Trash2,
    Send,
    X,
    Check,
    Terminal,
} from 'lucide-react';
import {
    toggleLikeAction,
    addCommentAction,
    deleteFeedPostAction,
    updateFeedPostAction,
    deleteCommentAction,
} from '@/app/feed/actions';
import { SmartMedia } from '@/components/ui/SmartMedia';
import { MediaSourceInput } from '@/components/admin/MediaSourceInput';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/Button';

export interface FeedComment {
    id: string;
    author_name: string;
    content: string;
    created_at: string;
}

export interface FeedPost {
    id: string;
    summary: string;
    image_url?: string | null;
    likes_count: number;
    published: boolean;
    published_at: string;
    comments: FeedComment[];
}

interface FeedPostCardProps {
    post: FeedPost;
    isAdmin: boolean;
    authorDisplayName?: string;
}

export function FeedPostCard({
    post,
    isAdmin,
    authorDisplayName = 'CSE Researcher',
}: FeedPostCardProps) {
    const router = useRouter();
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes_count || 0);
    const [showComments, setShowComments] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [commentAuthor, setCommentAuthor] = useState('');
    const [commentSubmitting, setCommentSubmitting] = useState(false);
    const [commentError, setCommentError] = useState<string | null>(null);

    // Admin inline edit & delete states
    const [isEditing, setIsEditing] = useState(false);
    const [savingEdit, setSavingEdit] = useState(false);
    const [deletingPost, setDeletingPost] = useState(false);

    // Remember visitor's local like state in browser storage
    useEffect(() => {
        const key = `liked_post_${post.id}`;
        if (typeof window !== 'undefined' && localStorage.getItem(key) === '1') {
            setLiked(true);
        }
    }, [post.id]);

    const handleToggleLike = async () => {
        const nextLiked = !liked;
        setLiked(nextLiked);
        setLikesCount((prev) => Math.max(0, prev + (nextLiked ? 1 : -1)));

        if (typeof window !== 'undefined') {
            localStorage.setItem(`liked_post_${post.id}`, nextLiked ? '1' : '0');
        }

        const res = await toggleLikeAction(post.id, nextLiked);
        if (res?.likesCount !== undefined) {
            setLikesCount(res.likesCount);
        }
    };

    const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCommentSubmitting(true);
        setCommentError(null);

        const formData = new FormData(e.currentTarget);
        const res = await addCommentAction(formData);
        setCommentSubmitting(false);

        if (res?.error) {
            setCommentError(res.error);
            return;
        }

        setCommentText('');
        router.refresh();
    };

    const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSavingEdit(true);
        const formData = new FormData(e.currentTarget);
        const res = await updateFeedPostAction(post.id, formData);
        setSavingEdit(false);

        if (res?.success) {
            setIsEditing(false);
            router.refresh();
        }
    };

    const handleDeletePost = async () => {
        if (!window.confirm('Delete this post and all its comments?')) return;
        setDeletingPost(true);
        await deleteFeedPostAction(post.id);
        router.refresh();
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!window.confirm('Delete this comment?')) return;
        await deleteCommentAction(commentId);
        router.refresh();
    };

    const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <article className="bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-md">
            {/* Post Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent shrink-0">
                        <Terminal size={18} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-primary-text">{authorDisplayName}</span>
                            {isAdmin && <StatusBadge published={post.published} />}
                        </div>
                        <time className="text-[11px] font-mono text-secondary-text">{formattedDate}</time>
                    </div>
                </div>

                {/* Admin Post Controls */}
                {isAdmin && !isEditing && (
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            title="Edit Post"
                            className="p-2 rounded-lg bg-background border border-border-subtle text-secondary-text hover:text-accent transition-colors"
                        >
                            <Pencil size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={handleDeletePost}
                            disabled={deletingPost}
                            title="Delete Post"
                            className="p-2 rounded-lg bg-background border border-border-subtle text-secondary-text hover:text-red-400 transition-colors disabled:opacity-50"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* Inline Edit Mode vs Normal Post View */}
            {isEditing ? (
                <form onSubmit={handleSaveEdit} className="px-5 pb-5 space-y-4">
                    <textarea
                        name="caption"
                        rows={4}
                        required
                        defaultValue={post.summary}
                        className="w-full px-3 py-2 bg-background border border-border-subtle rounded-xl text-sm text-primary-text focus:border-accent focus:outline-none"
                    />

                    <MediaSourceInput
                        name="imageUrl"
                        label="Post Image (Upload, External Link, or None)"
                        defaultValue={post.image_url || ''}
                    />

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-xs text-primary-text cursor-pointer">
                            <input
                                type="checkbox"
                                name="published"
                                defaultChecked={post.published}
                                className="accent-[#C4F269]"
                            />
                            <span>Published</span>
                        </label>

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditing(false)}
                                className="gap-1"
                            >
                                <X size={13} /> Cancel
                            </Button>
                            <Button type="submit" variant="accent" size="sm" disabled={savingEdit} className="gap-1">
                                <Check size={13} /> {savingEdit ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </div>
                </form>
            ) : (
                <>
                    {/* Caption */}
                    <div className="px-4 sm:px-5 pb-4">
                        <p className="text-sm text-primary-text leading-relaxed whitespace-pre-line">
                            {post.summary}
                        </p>
                    </div>

                    {/* Optional Image (Upload or External Link) */}
                    {post.image_url && (
                        <div className="border-y border-border-subtle bg-background">
                            <SmartMedia
                                url={post.image_url}
                                alt="Feed update media"
                                aspectRatio="auto"
                                className="rounded-none border-0 max-h-[520px]"
                            />
                        </div>
                    )}
                </>
            )}

            {/* Reaction & Comment Counts Bar */}
            <div className="px-4 sm:px-5 py-2.5 border-t border-border-subtle flex items-center justify-between text-xs font-mono text-secondary-text">
                <span>
                    {likesCount} {likesCount === 1 ? 'Reaction' : 'Reactions'}
                </span>
                <button
                    type="button"
                    onClick={() => setShowComments((prev) => !prev)}
                    className="hover:text-accent transition-colors"
                >
                    {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
                </button>
            </div>

            {/* Action Buttons (Like & Comment) */}
            <div className="px-4 sm:px-5 py-2 border-t border-border-subtle grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={handleToggleLike}
                    className={`py-2 rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-2 transition-colors ${liked
                            ? 'bg-accent/15 text-accent border border-accent/30'
                            : 'text-secondary-text hover:text-primary-text hover:bg-background'
                        }`}
                >
                    <Heart size={15} className={liked ? 'fill-accent text-accent' : ''} />
                    <span>{liked ? 'Liked' : 'Like'}</span>
                </button>

                <button
                    type="button"
                    onClick={() => setShowComments((prev) => !prev)}
                    className="py-2 rounded-lg text-xs font-mono font-medium text-secondary-text hover:text-primary-text hover:bg-background flex items-center justify-center gap-2 transition-colors"
                >
                    <MessageCircle size={15} />
                    <span>Comment</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="p-4 sm:p-5 bg-background/50 border-t border-border-subtle space-y-4">
                    {/* Existing Comments List */}
                    {post.comments.length > 0 && (
                        <div className="space-y-3">
                            {post.comments.map((c) => (
                                <div
                                    key={c.id}
                                    className="p-3 rounded-xl bg-surface border border-border-subtle flex items-start justify-between gap-3"
                                >
                                    <div className="space-y-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-primary-text">
                                                {c.author_name}
                                            </span>
                                            <span className="text-[10px] font-mono text-secondary-text">
                                                {new Date(c.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-secondary-text leading-relaxed break-words">
                                            {c.content}
                                        </p>
                                    </div>

                                    {/* Admin Can Delete Anyone's Comment */}
                                    {isAdmin && (
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteComment(c.id)}
                                            title="Delete Comment"
                                            className="p-1.5 rounded-md text-secondary-text hover:text-red-400 hover:bg-background transition-colors shrink-0"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add New Comment Form (Available to All Visitors) */}
                    <form onSubmit={handleAddComment} className="space-y-2">
                        <input type="hidden" name="activityId" value={post.id} />
                        {/* Hidden Honeypot Anti-Spam Field */}
                        <input
                            type="text"
                            name="website"
                            tabIndex={-1}
                            autoComplete="off"
                            className="hidden"
                        />

                        {commentError && (
                            <p className="text-[11px] font-mono text-red-400">{commentError}</p>
                        )}

                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                name="authorName"
                                required
                                value={commentAuthor}
                                onChange={(e) => setCommentAuthor(e.target.value)}
                                placeholder="Your name"
                                className="sm:w-40 px-3 py-2 bg-surface border border-border-subtle rounded-lg text-xs text-primary-text focus:border-accent focus:outline-none"
                            />
                            <div className="flex-1 flex gap-2">
                                <input
                                    name="content"
                                    required
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="flex-1 px-3 py-2 bg-surface border border-border-subtle rounded-lg text-xs text-primary-text focus:border-accent focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={commentSubmitting}
                                    aria-label="Submit comment"
                                    className="px-3 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors disabled:opacity-50"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </article>
    );
}