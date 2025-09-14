import React, { Fragment } from 'react';
import PlaceOrderButton from './placeOrderbutton';
export default function Menubar(){
    let log=0
    //const shoot = () => {
    //if 
 // }
    return(
        <Fragment>
            <div className='menu'>
                <h4>Menu</h4>
            <div>
            <p>Food 1
                <br></br>
            price: 10/-
            <br></br>
            <PlaceOrderButton/>
            </p>
            </div>
            <div>
            <p>Food 1
                <br></br>
            price: 10/-
            <br></br>
            <PlaceOrderButton/>
            </p>
            </div>
            <div>
            <p>Food 1
                <br></br>
            price: 10/-
            <br></br>
            <PlaceOrderButton/>
            </p>
            </div>
            <div>
            <p>Food 1
                <br></br>
            price: 10/-
            <br></br>
            <PlaceOrderButton/>
            </p>
            </div>
</div>
        </Fragment>
    )
}