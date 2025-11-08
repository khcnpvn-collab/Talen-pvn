
import React, { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';

interface ProblemStatementModalProps {
    session: Session;
    onClose: () => void;
}

const ProblemStatementModal: React.FC<ProblemStatementModalProps> = ({ session, onClose }) => {
    const [problem, setProblem] = useState('');
    const [statement, setStatement] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!problem.trim() || !statement.trim()) {
            setError('Vui lòng điền đầy đủ các trường Báo cáo vấn đề và Báo cáo đề xuất.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            let attachmentPath: string | null = null;
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;
                const filePath = `public/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('attachments')
                    .upload(filePath, file);

                if (uploadError) {
                    throw uploadError;
                }
                attachmentPath = filePath;
            }

            const { error: insertError } = await supabase
                .from('problem_statements')
                .insert([{ 
                    problem, 
                    statement, 
                    attachment_path: attachmentPath,
                    user_id: session.user.id 
                }]);

            if (insertError) {
                throw insertError;
            }
            
            setSuccess('Gửi báo cáo thành công!');
            setProblem('');
            setStatement('');
            setFile(null);
            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (err: any) {
            console.error('Error submitting form:', err);
            setError(`Đã có lỗi xảy ra: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <h2 className="text-2xl font-bold text-gray-800">Báo cáo Problem & Statement</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                        <div>
                            <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-1">
                                Báo cáo vấn đề (Problem)
                            </label>
                            <textarea
                                id="problem"
                                rows={4}
                                value={problem}
                                onChange={(e) => setProblem(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168a40] focus:border-[#168a40] sm:text-sm"
                                placeholder="Mô tả chi tiết vấn đề gặp phải..."
                            />
                        </div>
                        <div>
                            <label htmlFor="statement" className="block text-sm font-medium text-gray-700 mb-1">
                                Báo cáo đề xuất (Statement)
                            </label>
                            <textarea
                                id="statement"
                                rows={4}
                                value={statement}
                                onChange={(e) => setStatement(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168a40] focus:border-[#168a40] sm:text-sm"
                                placeholder="Đề xuất giải pháp hoặc hướng đi cho sản phẩm chiến lược..."
                            />
                        </div>
                        <div>
                            <label htmlFor="attachment" className="block text-sm font-medium text-gray-700">
                                File đính kèm (Tùy chọn)
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#168a40] hover:text-[#116c32] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#168a40]">
                                            <span>Tải lên một file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                        </label>
                                        <p className="pl-1">hoặc kéo và thả</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF, PDF, DOCX, etc.</p>
                                    {file && <p className="text-sm text-green-600 mt-2">{file.name}</p>}
                                </div>
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}
                        {success && <p className="text-sm text-green-600">{success}</p>}
                        
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#168a40]"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#168a40] hover:bg-[#116c32] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#168a40] disabled:bg-gray-400"
                            >
                                {isLoading ? 'Đang gửi...' : 'Gửi báo cáo'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProblemStatementModal;
