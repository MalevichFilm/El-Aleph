import React from 'react';

interface HeaderProps {
    currentLanguage: 'es' | 'ru';
    onLanguageChange: () => void;
    isTranslating: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentLanguage, onLanguageChange, isTranslating }) => {
    return (
        <header className="sticky top-0 bg-gray-800 text-white shadow-md z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-3">
                <h1 className="text-xl md:text-2xl font-bold font-serif">El Aleph y Otros Cuentos</h1>
                <button
                    onClick={onLanguageChange}
                    disabled={isTranslating}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {isTranslating ? 'Translating...' : (currentLanguage === 'es' ? 'Translate to Russian' : 'Leer en Español')}
                </button>
            </div>
        </header>
    );
};

export default Header;
