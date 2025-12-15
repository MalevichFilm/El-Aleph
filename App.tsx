import React, { useState, useCallback } from 'react';
import { Story } from './types';
import { STORIES } from './constants/stories';
import { translateStories } from './services/geminiService';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
    const [currentLanguage, setCurrentLanguage] = useState<'es' | 'ru'>('es');
    const [translatedStories, setTranslatedStories] = useState<Story[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleTranslate = useCallback(async () => {
        if (currentLanguage === 'ru') {
            setCurrentLanguage('es');
            return;
        }

        if (translatedStories) {
            setCurrentLanguage('ru');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const translation = await translateStories(STORIES);
            setTranslatedStories(translation);
            setCurrentLanguage('ru');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [currentLanguage, translatedStories]);

    const storiesToDisplay = currentLanguage === 'ru' && translatedStories ? translatedStories : STORIES;

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            {isLoading && <LoadingSpinner />}
            <Header
                currentLanguage={currentLanguage}
                onLanguageChange={handleTranslate}
                isTranslating={isLoading}
            />
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 max-w-4xl mx-auto" role="alert">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}
                <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 lg:p-12 max-w-4xl mx-auto">
                    {storiesToDisplay.map((story, index) => (
                        <article key={index} className="mb-12 last:mb-0">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 font-serif border-b-2 pb-3 border-gray-200">
                                {story.title}
                            </h2>
                            <div className="text-gray-700 text-lg leading-relaxed font-serif whitespace-pre-wrap">
                                {story.content}
                            </div>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default App;