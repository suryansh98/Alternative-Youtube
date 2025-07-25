import { Router, Request, Response } from 'express';
import { YouTubeService } from '../services/youtubeService';

const router = Router();

// Middleware to check if user is authenticated
const requireAuth = (req: Request, res: Response, next: any) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Get user's channel information
router.get('/channel', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user as any; // Type assertion for now
    const youtubeService = new YouTubeService(user.accessToken);
    const channelInfo = await youtubeService.getChannelInfo();
    res.json(channelInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch channel information' });
  }
});

// Get user's playlists
router.get('/playlists', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const youtubeService = new YouTubeService(user.accessToken);
    const playlists = await youtubeService.getPlaylists();
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

// Get user's subscriptions
router.get('/subscriptions', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const youtubeService = new YouTubeService(user.accessToken);
    const subscriptions = await youtubeService.getSubscriptions();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// Get user's liked videos
router.get('/liked-videos', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const youtubeService = new YouTubeService(user.accessToken);
    const likedVideos = await youtubeService.getLikedVideos();
    res.json(likedVideos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch liked videos' });
  }
});

// Get user's watch history
router.get('/watch-history', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const youtubeService = new YouTubeService(user.accessToken);
    const watchHistory = await youtubeService.getWatchHistory();
    res.json(watchHistory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch watch history' });
  }
});

// Get videos from a specific playlist
router.get('/playlist/:playlistId/videos', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const { playlistId } = req.params;
    const youtubeService = new YouTubeService(user.accessToken);
    const playlistVideos = await youtubeService.getPlaylistVideos(playlistId);
    res.json(playlistVideos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch playlist videos' });
  }
});

// Search for videos
router.get('/search', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const { q, maxResults } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const youtubeService = new YouTubeService(user.accessToken);
    const searchResults = await youtubeService.searchVideos(
      q as string, 
      maxResults ? parseInt(maxResults as string) : 25
    );
    res.json(searchResults);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search videos' });
  }
});

// Get video details by ID
router.get('/video/:videoId', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const { videoId } = req.params;
    const youtubeService = new YouTubeService(user.accessToken);
    const videoDetails = await youtubeService.getVideoDetails(videoId);
    res.json(videoDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch video details' });
  }
});

// get latest videos from all subscribed channels
router.get('/latest-videos', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const youtubeService = new YouTubeService(user.accessToken);
    const subscriptions = await youtubeService.getSubscriptions();

    interface SubscriptionItem {
        snippet: {
            resourceId: {
                channelId: string;
            };
        };
    }

    const tenRandomSubscriptions = subscriptions.items?.length ?? 0;

    const randomIndexes = Array.from({ length: 10 }, () => Math.floor(Math.random() * tenRandomSubscriptions));

    // Get only top 10 subscriptions and handle promises properly
    const videoPromises = subscriptions?.items?.map(async (sub, index) => {
        try {
            if( randomIndexes.includes(index) ) {
                return await youtubeService.getChannelLatestVideos(sub?.snippet?.resourceId?.channelId as string, 1);
            }
        } catch (error) {
            console.error(`Error fetching videos for channel:`, error);
            return null;
        }
    }) || [];

    // Wait for all promises to resolve
    const videoResults = await Promise.all(videoPromises);
    
    // Filter out null results and flatten the array
    const latestVideos = videoResults
        .filter((result: any) => result !== null)
        .flatMap((result: any) => result?.items || []);

    console.log(`Found ${latestVideos.length} latest videos from top 10 channels`);
    res.json({ 
        items: latestVideos,
        count: latestVideos.length 
    });
  }
  catch (error) {
    console.error('Error fetching latest videos:', error);
    res.status(500).json({ error: 'Failed to fetch latest videos' });
  }
});

export default router;
