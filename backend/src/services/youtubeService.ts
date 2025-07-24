import { google } from 'googleapis';

const youtube = google.youtube('v3');

export class YouTubeService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  // Get user's channel information
  async getChannelInfo() {
    try {
      const response = await youtube.channels.list({
        access_token: this.accessToken,
        part: ['snippet', 'statistics', 'contentDetails'],
        mine: true,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching channel info:', error);
      throw error;
    }
  }

  // Get user's playlists
  async getPlaylists() {
    try {
      const response = await youtube.playlists.list({
        access_token: this.accessToken,
        part: ['snippet', 'contentDetails'],
        mine: true,
        maxResults: 50,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching playlists:', error);
      throw error;
    }
  }

  // Get user's subscriptions
  async getSubscriptions() {
    try {
      const response = await youtube.subscriptions.list({
        access_token: this.accessToken,
        part: ['snippet'],
        mine: true,
        maxResults: 50,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw error;
    }
  }

  // Get user's liked videos
  async getLikedVideos() {
    try {
      const response = await youtube.videos.list({
        access_token: this.accessToken,
        part: ['snippet', 'statistics'],
        myRating: 'like',
        maxResults: 50,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching liked videos:', error);
      throw error;
    }
  }

  // Get user's watch history (requires additional scope)
  async getWatchHistory() {
    try {
      // First get the user's channel to find their watch history playlist
      const channelResponse = await youtube.channels.list({
        access_token: this.accessToken,
        part: ['contentDetails'],
        mine: true,
      });

      if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
        throw new Error('No channel found');
      }

      // Note: Watch history might not be available due to privacy settings
      const watchHistoryPlaylistId = channelResponse.data.items[0].contentDetails?.relatedPlaylists?.watchHistory;
      
      if (!watchHistoryPlaylistId) {
        throw new Error('Watch history not available');
      }

      const response = await youtube.playlistItems.list({
        access_token: this.accessToken,
        part: ['snippet'],
        playlistId: watchHistoryPlaylistId,
        maxResults: 50,
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching watch history:', error);
      throw error;
    }
  }

  // Get videos from a specific playlist
  async getPlaylistVideos(playlistId: string) {
    try {
      const response = await youtube.playlistItems.list({
        access_token: this.accessToken,
        part: ['snippet', 'contentDetails'],
        playlistId: playlistId,
        maxResults: 50,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching playlist videos:', error);
      throw error;
    }
  }

  // Search for videos
  async searchVideos(query: string, maxResults: number = 25) {
    try {
      const response = await youtube.search.list({
        access_token: this.accessToken,
        part: ['snippet'],
        q: query,
        type: ['video'],
        maxResults: maxResults,
      });
      return response.data;
    } catch (error) {
      console.error('Error searching videos:', error);
      throw error;
    }
  }

  // Get video details by ID
  async getVideoDetails(videoId: string) {
    try {
      const response = await youtube.videos.list({
        access_token: this.accessToken,
        part: ['snippet', 'statistics', 'contentDetails'],
        id: [videoId],
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching video details:', error);
      throw error;
    }
  }

  // Get latest videos from a specific channel
  async getChannelLatestVideos(channelId: string, maxResults: number = 5) {
    try {
      const response = await youtube.search.list({
        access_token: this.accessToken,
        part: ['snippet'],
        channelId: channelId,
        type: ['video'],
        order: 'date',
        maxResults: maxResults,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching channel latest videos:', error);
      throw error;
    }
  }
}