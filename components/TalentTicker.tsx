import React from 'react';

const tickerData = [
    {
        id: 1,
        quote: "Có tài mà không có đức là người vô dụng. Có đức mà không có tài thì làm việc gì cũng khó.",
        author: "Hồ Chí Minh",
        image: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Ho_Chi_Minh_1946.jpg"
    },
    {
        id: 2,
        quote: "Nhân tài như lá mùa thu, tuấn kiệt như sao buổi sớm.",
        author: "Nguyễn Trãi",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Nguyen_Trai_-_VNT.jpg/800px-Nguyen_Trai_-_VNT.jpg"
    },
    {
        id: 3,
        quote: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg/800px-Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg"
    },
    {
        id: 4,
        quote: "The true sign of intelligence is not knowledge but imagination.",
        author: "Albert Einstein",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Einstein_1921_by_F_Schmutzer_-_restoration.jpg/800px-Einstein_1921_by_F_Schmutzer_-_restoration.jpg"
    },
    {
        id: 5,
        quote: "Hiền tài là nguyên khí của quốc gia, nguyên khí thịnh thì thế nước mạnh.",
        author: "Thân Nhân Trung",
        image: null // No verifiable image
    },
    {
        id: 6,
        quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
        author: "Aristotle",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Aristoteles_Louvre.jpg/800px-Aristoteles_Louvre.jpg"
    }
];

const TickerItem: React.FC<{ item: typeof tickerData[0] }> = ({ item }) => (
    <div className="inline-flex items-center mx-8">
        {item.image && (
            <img src={item.image} alt={item.author} className="w-8 h-8 rounded-full object-cover mr-4 flex-shrink-0" />
        )}
        <div className="flex flex-col">
            <p className="text-sm italic text-gray-200">"{item.quote}"</p>
            <p className="text-xs font-bold text-amber-400 text-right mt-1">- {item.author}</p>
        </div>
    </div>
);


const TalentTicker: React.FC = () => {
    // Duplicate the data for a seamless loop
    const extendedTickerData = [...tickerData, ...tickerData];

    return (
        <div className="relative w-full overflow-hidden whitespace-nowrap py-2 border-y border-white/20">
            <div className="inline-block animate-scroll">
                {extendedTickerData.map((item, index) => (
                    <TickerItem key={`${item.id}-${index}`} item={item} />
                ))}
            </div>
            <div className="absolute top-0 left-0 w-12 h-full bg-gradient-to-r from-[#004d25] to-transparent"></div>
            <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-[#004d25] to-transparent"></div>
        </div>
    );
};

export default TalentTicker;