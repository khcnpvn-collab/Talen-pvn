import React from 'react';

interface TalentDefinitionModalProps {
    onClose: () => void;
}

const TalentDefinitionModal: React.FC<TalentDefinitionModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-3xl font-bold text-gray-800 font-serif">Quan niệm về "Nhân tài" trong lịch sử Việt Nam</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                        <p>
                            Trong suốt dòng chảy lịch sử, "nhân tài" luôn là một khái niệm cốt lõi, được các bậc tiền nhân coi là yếu tố quyết định sự thịnh suy của quốc gia. Quan niệm này được đúc kết qua nhiều áng văn thơ và tư tưởng bất hủ.
                        </p>
                        
                        <div className="p-4 border-l-4 border-[#004d25]">
                            <h3 className="font-bold text-xl text-[#004d25]">1. Thân Nhân Trung - Nguyên khí quốc gia</h3>
                            <p className="mt-2 italic">
                                "Hiền tài là nguyên khí của quốc gia, nguyên khí thịnh thì thế nước mạnh, rồi lên cao, nguyên khí suy thì thế nước yếu, rồi xuống thấp."
                            </p>
                            <p className="mt-2">
                                Câu nói bất hủ được khắc trên bia tiến sĩ tại Văn Miếu - Quốc Tử Giám của Thân Nhân Trung đã khẳng định một chân lý: người tài giỏi và có đức độ chính là sinh khí, là sức sống của đất nước. Việc trọng dụng hiền tài không chỉ là chính sách mà còn là nền tảng để xây dựng một quốc gia hùng cường.
                            </p>
                        </div>

                        <div className="p-4 border-l-4 border-[#b45309]">
                            <h3 className="font-bold text-xl text-[#b45309]">2. Nguyễn Trãi - Sự quý hiếm của nhân tài</h3>
                            <p className="mt-2 italic">
                                "Nhân tài như lá mùa thu, tuấn kiệt như sao buổi sớm."
                            </p>
                            <p className="mt-2">
                                Trong "Bình Ngô Đại Cáo", Nguyễn Trãi ví von nhân tài tuy nhiều như lá mùa thu nhưng người thực sự kiệt xuất (tuấn kiệt) thì lại hiếm hoi như sao buổi sớm. Điều này nhấn mạnh sự quý giá của những cá nhân ưu tú và nhắc nhở các bậc quân vương phải biết tìm kiếm, trân trọng và đãi ngộ xứng đáng để họ cống hiến cho đất nước.
                            </p>
                        </div>

                         <div className="p-4 border-l-4 border-gray-600">
                            <h3 className="font-bold text-xl text-gray-700">3. Hồ Chí Minh - Sự kết hợp giữa Đức và Tài</h3>
                            <p className="mt-2 italic">
                                "Có tài mà không có đức là người vô dụng. Có đức mà không có tài thì làm việc gì cũng khó."
                            </p>
                            <p className="mt-2">
                                Chủ tịch Hồ Chí Minh đã phát triển quan niệm về nhân tài lên một tầm cao mới, nhấn mạnh sự song hành không thể tách rời giữa "Đức" (phẩm chất đạo đức, lý tưởng) và "Tài" (năng lực, chuyên môn). Một người tài thực thụ phải là người vừa có năng lực xuất sắc, vừa có đạo đức trong sáng, hết lòng vì dân vì nước. Đây là tiêu chuẩn toàn diện cho cán bộ và nhân tài trong thời đại mới.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TalentDefinitionModal;
