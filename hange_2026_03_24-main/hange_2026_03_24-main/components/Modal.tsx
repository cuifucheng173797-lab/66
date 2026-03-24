
import React from 'react';
import { I18nData } from '../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (email: string, pass: string) => void;
  isVerifying: boolean;
  langData: I18nData;
  errorMsg?: string | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onVerify, isVerifying, langData, errorMsg }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-white/60 backdrop-blur-sm animate-in fade-in duration-500" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-[480px] bg-white rounded-[2.5rem] p-12 text-left shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] animate-in zoom-in-95 duration-500 ease-out border border-slate-50">
        <h2 className="text-[2.5rem] font-bold text-[#1e293b] leading-tight mb-2 tracking-tight">
          {langData.welcomeBack}
        </h2>
        <p className="text-[#64748b] text-lg mb-10">
          {langData.subtitle}
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[#334155] font-medium text-base ml-1">
              {langData.emailLabel}
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@association.org"
              className="w-full px-5 py-4 bg-[#f8fafc] border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/5 transition-all duration-300 text-base text-[#1e293b] placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[#334155] font-medium text-base ml-1">
              {langData.passwordLabel}
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-4 bg-[#f8fafc] border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/5 transition-all duration-300 text-base text-[#1e293b]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 mb-8 px-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#4f46e5] focus:ring-[#4f46e5] cursor-pointer" />
            <span className="text-sm text-[#64748b] group-hover:text-[#4f46e5] transition-colors">
              {langData.rememberMe}
            </span>
          </label>
          <button className="text-sm text-[#4f46e5] hover:text-[#4338ca] font-medium transition-colors">
            {langData.forgotPassword}
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 text-center text-sm font-medium text-red-500 bg-red-50 py-2 rounded-lg">
            {errorMsg}
          </div>
        )}

        <button 
          onClick={() => onVerify(email, password)}
          disabled={isVerifying || !email || !password}
          className="w-full py-4 bg-[#4f46e5] hover:bg-[#4338ca] disabled:opacity-70 text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)] hover:shadow-[0_15px_25px_-5px_rgba(79,70,229,0.5)] active:scale-[0.98]"
        >
          {isVerifying ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          ) : (
            langData.submit
          )}
        </button>

        <div className="text-center mt-6">
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors uppercase tracking-widest"
          >
            返回
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-400 font-medium mb-3 uppercase tracking-wider">测试账号 (Test Accounts)</p>
          <div className="space-y-2 text-xs text-slate-500">
            <div className="flex justify-between">
              <span>超级管理员:</span>
              <span className="font-mono text-[#4f46e5]">admin@hangai.com / admin123</span>
            </div>
            <div className="flex justify-between">
              <span>企业A (光辉会展):</span>
              <span className="font-mono text-[#4f46e5]">a@hangai.com / 123456</span>
            </div>
            <div className="flex justify-between">
              <span>企业B (星辰公关):</span>
              <span className="font-mono text-[#4f46e5]">b@hangai.com / 123456</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
