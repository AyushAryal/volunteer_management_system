import React from "react";
import Navbar from "../components/Sidebar";
import Footer from "../components/footer";


export default class BaseComponent extends React.Component{
    render(){
    return<>
        <Navbar/>
        <Footer/>
    </>};
};
