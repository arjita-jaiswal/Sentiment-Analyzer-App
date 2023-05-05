const natural = require('natural');
const aposToLexForm = require('apos-to-lex-form');
const SW = require('stopword');
const SpellCorrector = require('spelling-corrector');

async function loadModel(text) {
    const lexedReview = aposToLexForm(text);
    const casedReview = lexedReview.toLowerCase();
    const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');

    const { WordTokenizer } = natural;
    const tokenizer = new WordTokenizer();
    const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);

    const spellCorrector = new SpellCorrector();
    spellCorrector.loadDictionary();

    tokenizedReview.forEach((word, index) => {
        tokenizedReview[index] = spellCorrector.correct(word);
    })
    const filteredReview = SW.removeStopwords(tokenizedReview);

    const { SentimentAnalyzer, PorterStemmer } = natural;
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    const score = analyzer.getSentiment(filteredReview);
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