/**
 * Text operations.
 */
public class TextProcessing {

    /**
     * Reverse words in sentence.
     * @param text sentence.
     * @return sentence with reversed words.
     */
    public String reverseWords(String text) {
        char[] textToChar = text.toCharArray();
        boolean readDirectionLeft = true;
        String temp = "";
        int start = 0; int end = textToChar.length - 1;
        String textBegin = ""; String textEnd = "";
        while(start <= end) {
            ReservWorldTemp temporary;
            if (readDirectionLeft) {
                temporary = processLeftSide(end
                        , new ReservWorldTemp(start, temp, textBegin), textToChar);
                start = temporary.index;
                textBegin = temporary.side;
            }
            else {
                temporary = processRightSide(start, new ReservWorldTemp(end, temp, textEnd), textToChar);
                end = temporary.index;
                textEnd = temporary.side;
            }
            temp = temporary.temp;
            readDirectionLeft = !readDirectionLeft;
        }
        return textBegin + temp + textEnd;
    }

    /**
     * Controls if this character is part of a word.
     * @param c character.
     * @return boolean.
     */
    private boolean isLetter(char c) {
        return Character.isAlphabetic(c);
    }

    /**
     * Controls if character not a part of word.
     * @param c character.
     * @return boolean.
     */
    private boolean isNotLetter(char c) {
        return !Character.isLetter(c);
    }

    /**
     * Process left side of sentence.
     * Find the left most word and save this word.
     * Add previously saved word to the left most part of sentence.
     * Substring visited part of sentence.
     * @param end end index of sentence.
     * @param token saved data.
     * @param textToChar initial sentence.
     * @return saved data.
     */
    private ReservWorldTemp processLeftSide(int end, ReservWorldTemp token, char[] textToChar) {
        token.side += token.temp;
        token.temp = "";
        while(token.index <= end && isNotLetter(textToChar[token.index])) {
            token.side += textToChar[token.index];
            token.index++;
        }
        for (;token.index <= end; token.index++) {
            if (!isLetter(textToChar[token.index])) break;
            token.temp += textToChar[token.index];
        }
        return token;
    }

    /**
     * Process right side of sentence.
     * Find the right most word and save this word.
     * Add previously saved word after saved word.
     * Substring visited part of sentence.
     * @param start started index of sentence.
     * @param token saved data.
     * @param textToChar initial sentence.
     * @return saved data.
     */
    private ReservWorldTemp processRightSide(int start, ReservWorldTemp token, char[] textToChar) {
        while(token.index >= start && isNotLetter(textToChar[token.index])) {
            token.side = textToChar[token.index] + token.side;
            token.index--;
        }
        token.side = token.temp + token.side;
        token.temp = "";
        for (;token.index >= start; token.index--) {
            if (!isLetter(textToChar[token.index])) break;
            token.temp = textToChar[token.index] + token.temp;
        }
        return token;
    }

    /**
     * Saved data for reverse sentence.
     */
    private static class ReservWorldTemp {
        /**
         * Start or end index of sentence.
         */
        int index;
        /**
         * Saved word.
         */
        String temp;
        /**
         * Processed part of sentence.
         */
        String side;

        public ReservWorldTemp(int index, String temp, String side) {
            this.index = index;
            this.temp = temp;
            this.side = side;
        }
    }
}
