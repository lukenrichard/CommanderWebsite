import React, { Component } from "react";
import "../styles.css";

export class ManaGenerator extends Component {
    constructor(props) {
      super(props);
    }

    render() {
        var manaString = String(this.props.mana);
        manaString = manaString.replace(/{/g, "");
        manaString = manaString.replace(/}/g, " ");
        var mana = [];
        mana = manaString.split(' ');
        mana.pop();
        for (var i=0; i<mana.length; i++){
            if (mana[i] == 'G') {
                mana[i] = "./pictures/Mana_G.png"
            }
            else if (mana[i] == 'U') {
                mana[i]="./pictures/Mana_U.png"
            }
            else if (mana[i] == 'B') {
                mana[i]="./pictures/Mana_B.png"
            }
            else if (mana[i] == 'W') {
                mana[i]="./pictures/Mana_W.png"
            }
            else if (mana[i] == 'R') {
                mana[i]="./pictures/Mana_R.png"
            }
            else if (mana[i] == '0') {
                mana[i]="./pictures/Mana_0.svg"
            }
            else if (mana[i] == '1') {
                mana[i]="./pictures/Mana_1.svg"
            }
            else if (mana[i] == '2') {
                mana[i]="./pictures/Mana_2.svg"
            }
            else if (mana[i] == '3') {
                mana[i]="./pictures/Mana_3.svg"
            }
            else if (mana[i] == '4') {
                mana[i]="./pictures/Mana_4.svg"
            }
            else if (mana[i] == '5') {
                mana[i]="./pictures/Mana_5.svg"
            }
            else if (mana[i] == '6') {
                mana[i]="./pictures/Mana_6.svg"
            }
            else if (mana[i] == '7') {
                mana[i]="./pictures/Mana_7.svg"
            }
            else if (mana[i] == '8') {
                mana[i]="./pictures/Mana_8.svg"
            }
            else if (mana[i] == '9') {
                mana[i]="./pictures/Mana_9.svg"
            }

        }
        return(
            <div>
                {mana.map((item) => <img className="mana_symbols" src={item}/>)}
            </div>
    );
    }
  }
  
  export default ManaGenerator;