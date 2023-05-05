const natural = require('natural');
const aposToLexForm = require('apos-to-lex-form');
const SW = require('stopword');
const SpellCorrector = require('spelling-corrector');

// Text Analyzer
async function loadModel(text) {
    const lexedReview = aposToLexForm(text);
    const casedReview = lexedReview.toLowerCase();
    const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');

    // Tokenize words
    const { WordTokenizer } = natural;
    const tokenizer = new WordTokenizer();
    const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);

    // Correct Spelling if there is any mistake
    const spellCorrector = new SpellCorrector();
    spellCorrector.loadDictionary();

    // Tokenize words
    tokenizedReview.forEach((word, index) => {
        tokenizedReview[index] = spellCorrector.correct(word);
    })
    // Remove Stopword
    const filteredReview = SW.removeStopwords(tokenizedReview);

    // Analyze sentiment of text
    const { SentimentAnalyzer, PorterStemmer } = natural;
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    const score = analyzer.getSentiment(filteredReview);

    // Classify scores 
    /*
        score > 0 : Positive sentiment
        score < 0 : Negative Sentiment
        score = 0 : Neutral Sentiment
    */
    if (score>0) {
        sentiment = 'Positive'
    }
    else if (score<0){
        sentiment = 'Negative';
    }
    else {
        sentiment = 'Neutral';
    }
    return {'score': score,
            'sentiment': sentiment}
}
module.exports={ loadModel };