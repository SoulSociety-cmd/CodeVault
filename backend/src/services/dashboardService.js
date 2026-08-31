import Snippet from '../models/Snippet.js'

export async function getDashboardStats(userId) {
  // Get total snippets count (not deleted)
  const totalSnippets = await Snippet.countDocuments({ owner: userId, deletedAt: null })

  // Get public/private counts
  const publicSnippets = await Snippet.countDocuments({
    owner: userId,
    visibility: 'public',
    deletedAt: null,
  })
  const privateSnippets = await Snippet.countDocuments({
    owner: userId,
    visibility: 'private',
    deletedAt: null,
  })

  // Get total favorites and views
  const stats = await Snippet.aggregate([
    { $match: { owner: userId, deletedAt: null } },
    {
      $group: {
        _id: null,
        totalFavorites: { $sum: '$favorites' },
        totalViews: { $sum: '$views' },
      },
    },
  ])

  const totalFavorites = stats.length > 0 ? stats[0].totalFavorites : 0
  const totalViews = stats.length > 0 ? stats[0].totalViews : 0

  // Get language statistics (top 10)
  const languageStats = await Snippet.aggregate([
    { $match: { owner: userId, deletedAt: null } },
    {
      $group: {
        _id: '$language',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ])

  // Get recent snippets (last 5, ordered by creation date)
  const recentSnippets = await Snippet.find({ owner: userId, deletedAt: null })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title language slug views favorites createdAt')

  // Get most viewed snippets (top 5)
  const mostViewedSnippets = await Snippet.find({ owner: userId, deletedAt: null })
    .sort({ views: -1 })
    .limit(5)
    .select('title language slug views favorites createdAt')

  // Get most favorited snippets (top 5)
  const mostFavoritedSnippets = await Snippet.find({ owner: userId, deletedAt: null })
    .sort({ favorites: -1 })
    .limit(5)
    .select('title language slug views favorites createdAt')

  // Get recent activity (last 10 snippets - created or updated)
  const recentActivity = await Snippet.find({ owner: userId, deletedAt: null })
    .sort({ updatedAt: -1 })
    .limit(10)
    .select('title language slug views favorites updatedAt createdAt')

  return {
    stats: {
      totalSnippets,
      public: publicSnippets,
      private: privateSnippets,
      favorites: totalFavorites,
      views: totalViews,
    },
    languageStats,
    recentSnippets,
    mostViewedSnippets,
    mostFavoritedSnippets,
    recentActivity,
  }
}
    mostViewedSnippets,
    mostFavoritedSnippets,
    recentActivity,
  }
}
