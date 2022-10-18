const fiveLetterWords = [
  "Admit","Agree","Allow","Alter","Apply","Argue","Arise","Avoid","Begin","Blame","Break","Bring","Build","Burst","Carry","Catch","Cause","Check","Claim","Clean","Clear","Climb","Close","Count","Cover","Cross","Dance","Doubt","Drink","Drive","Enjoy","Enter","Exist","Fight","Focus","Force","Guess","Imply","Issue","Judge","Laugh","Learn","Leave","Let’s","Limit","Marry","Match","Occur","Offer","Order","Phone","Place","Point","Press","Prove","Raise","Reach","Refer","Relax","Serve","Shall","Share","Shift","Shoot","Sleep","Solve","Sound","Speak","Spend","Split","Stand","Start","State","Stick","Study","Teach","Thank","Think","Throw","Touch","Train","Treat","Trust","Visit","Voice","Waste","Watch","Worry","Would","Write"];

  

  export const getWord = () => {
    const randomIndex = Math.floor(Math.random() * fiveLetterWords.length);
    return fiveLetterWords[randomIndex];
  }

  export const fiveLetterWord = getWord();