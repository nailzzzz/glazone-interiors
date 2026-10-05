import React from 'react';
import { MdLink, MdImageNotSupported } from 'react-icons/md';

export default function ImageUrlInput({ value, onChange, disabled }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Image URL
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MdLink className="text-slate-400" />
          </div>
          <input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="https://example.com/image.jpg"
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky disabled:opacity-60"
          />
        </div>
      </div>
      
      {/* Live Preview */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex flex-col items-center justify-center min-h-[160px] overflow-hidden relative">
        {value ? (
          <img
            src={value}
            alt="Preview"
            className="max-h-[200px] object-contain rounded"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextSibling.style.display = 'flex';
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
            <span className="text-sm">No image selected</span>
            <span className="text-xs mt-1">Paste a URL above to preview</span>
          </div>
        )}
        
        {/* Error Fallback (Hidden by default, shown via onError) */}
        {value && (
          <div style={{ display: 'none' }} className="flex-col items-center justify-center text-slate-400 p-4 text-center">
            <MdImageNotSupported className="text-4xl mb-2 opacity-50 mx-auto" />
            <span className="text-sm font-medium text-rose-500">Invalid image URL</span>
            <span className="text-xs mt-1">Image failed to load</span>
          </div>
        )}
      </div>
    </div>
  );
}
