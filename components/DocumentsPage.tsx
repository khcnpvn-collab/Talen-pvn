
import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';

interface Document {
  id: string;
  created_at: string;
  file_name: string;
  file_path: string;
}

interface Profile {
  id: string;
  role: string;
}

interface DocumentsPageProps {
  session: Session;
  onBack: () => void;
}

const DocumentsPage: React.FC<DocumentsPageProps> = ({ session, onBack }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const fetchDocumentsAndProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: documentsData, error: documentsError } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (documentsError) throw documentsError;
      setDocuments(documentsData || []);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', session.user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') { // Ignore 'PGRST116' (No rows found)
        throw profileError;
      }
      setProfile(profileData);

    // FIX: Added missing curly braces to the catch block to correct the syntax error.
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentsAndProfile();
  }, [session.user.id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const fileExt = file.name.split('.').pop();
      // FIX: Simplified the file path to upload to the root of the bucket, removing the redundant 'documents/' prefix.
      const filePath = `${session.user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from('documents')
        .insert({
          file_name: file.name,
          file_path: filePath,
          uploaded_by: session.user.id
        });
      
      if (insertError) throw insertError;
      
      e.target.value = ''; // Reset input to allow re-uploading the same file
      fetchDocumentsAndProfile();

    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const downloadFile = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage.from('documents').download(filePath);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert("Lỗi tải file: " + err.message);
    }
  };

  const isSuperAdmin = session.user.email === 'vpi.sonnt@pvn.vn';
  const isAdmin = profile?.role === 'admin' || isSuperAdmin;

  return (
    <div>
       <button onClick={onBack} className="text-sm font-medium text-[#168a40] hover:underline flex items-center mb-2">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            Quay lại Cổng
       </button>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Văn bản và Tài liệu</h1>
        {isAdmin && (
          <div className="relative">
            <label htmlFor="doc-upload" className={`inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#168a40] hover:bg-[#116c32] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#168a40] ${uploading ? 'cursor-not-allowed bg-gray-400' : 'cursor-pointer'}`}>
              {uploading ? 'Đang tải lên...' : 'Tải lên tài liệu mới'}
            </label>
            <input id="doc-upload" name="doc-upload" type="file" className="sr-only" onChange={handleFileUpload} disabled={uploading}/>
          </div>
        )}
      </div>
      
      {uploadError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{uploadError}</div>}
      
      {isLoading && <p>Đang tải tài liệu...</p>}
      {error && <p className="text-red-600">Lỗi: {error}</p>}

      {!isLoading && !error && (
        <>
          {documents.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul role="list" className="divide-y divide-gray-200">
                {documents.map((doc) => (
                  <li key={doc.id}>
                    <div className="px-4 py-4 sm:px-6 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center min-w-0">
                         <svg className="h-6 w-6 text-gray-400 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-[#168a40] truncate">{doc.file_name}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Tải lên lúc: {new Date(doc.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          onClick={() => downloadFile(doc.file_path, doc.file_name)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#168a40]"
                        >
                          Tải về
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            isAdmin ? (
                <div className="mt-4">
                     <label htmlFor="doc-upload-dnd" className={`relative block w-full border-2 border-dashed rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#168a40] ${uploading ? 'border-gray-200' : 'border-gray-300 hover:border-gray-400 cursor-pointer'}`}>
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                           {uploading ? 'Đang tải lên...' : 'Kéo và thả file hoặc bấm để tải lên'}
                        </span>
                        <p className="mt-1 text-xs text-gray-500">
                            Hỗ trợ các định dạng phổ biến (PDF, DOCX, PNG, JPG...)
                        </p>
                        <input id="doc-upload-dnd" name="doc-upload-dnd" type="file" className="sr-only" onChange={handleFileUpload} disabled={uploading}/>
                    </label>
                </div>
            ) : (
                <div className="text-center py-16 px-4 border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-500">Chưa có tài liệu nào được tải lên.</p>
                </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default DocumentsPage;
