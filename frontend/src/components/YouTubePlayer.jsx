const YouTubePlayer = ({ url }) => {
    // Lấy id từ link đầy đủ
    const getVideoId = (youtubeUrl) => {
        try{
            const urlObj = new URL(youtubeUrl);
            return urlObj.searchParams.get("v");
        } catch (error) {
            return null;
        }
        
        
    };

    const videoId = getVideoId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    return (
        <div className="w-full aspect-video">
            <iframe
                className="w-full h-full rounded-lg"
                src={embedUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                frameBorder="0"
            ></iframe>
        </div>
    );
};

export default YouTubePlayer; 