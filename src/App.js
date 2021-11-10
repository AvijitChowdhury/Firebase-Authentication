import './App.css';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase-config';
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth, signInWithPopup} from "firebase/auth";
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import {  signOut } from "firebase/auth";
import {Form} from 'react-bootstrap';
import { createUserWithEmailAndPassword } from "firebase/auth";
import {  signInWithEmailAndPassword } from "firebase/auth";
import { updateProfile } from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";







function App() {
  const [newUser,setNewUser]= useState(false);
  const [user,setUser] = useState({
    isSignedIn:false,
    Name:'',
    Email:'',
    Password:'',
    Photo:'',
    
  });
//firebase authentication
  initializeApp(firebaseConfig);
  const fbprovider = new FacebookAuthProvider();
const provider = new GoogleAuthProvider();

 
  const handleClicked = ()=>{
    // console.log('clicked');
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // console.log(result);
        const {displayName,email,photoURL} = result.user;
        const signedIn={
          isSignedIn:true,
          Name:displayName,
          Email:email,
          Photo:photoURL,
         
          
        }
        setUser(signedIn);
        console.log(displayName,email,photoURL);
      }).catch((error) => {
        console.log(error);
        console.log(error.message);
      });
  }

//fb sign in
  const handleFbSignIn = ()=>{
    const auth = getAuth();
    signInWithPopup(auth, fbprovider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;
    
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        console.log('fb sign in',user);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);
    
        // ...
      });
  }

  const signOutButton = ()=>{
    const auth = getAuth();
    signOut(auth).then((result) => {
      // Sign-out successful
      const SignOutuser ={
        isSignedIn:false,
        Name:'',
        Email:'',
        photoURL:'',
        error:'',
        success:false,
      }
      setUser(SignOutuser);
      console.log(result);

    }).catch((error) => {
      // An error happened.
      console.log(error);
    });
  }

  //form controls
  const handleBlur=(event)=>{
    console.log(event.target.name,event.target.value);
    let isFieldValid = true;
    if(event.target.name==="email"){
      //const isEmailValid = /\S+@\S+\.\S+/.test(event.target.value);
      // console.log(isEmailValid);
      isFieldValid=/\S+@\S+\.\S+/.test(event.target.value);
      
     
    }
    if(event.target.name==="password"){
      const isPassValid = event.target.value.length>6;
      const passHasNum = /\d{1}/.test(event.target.value);
      // console.log(isPassValid && passHasNum);
      isFieldValid=isPassValid && passHasNum;
    }
    if(isFieldValid){
      const newUserInfo = {...user};
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
  }


//submit button
  const handleSubmit= (event)=>{
    console.log(user.Email,user.Password);
    if(newUser && user.Email && user.Password){
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, user.Email, user.Password)
        .then((userCredential) => {
          
          // Signed in 
          const user = userCredential.user;
          // ...
          const newUserInfo={...user};
          newUserInfo.error = '';
          newUserInfo.success =  true;
          setUser(newUserInfo);
          updateUserProfile(user.name);
          console.log(user);
        })
        .catch((error) => {
          // const errorCode = error.code;
          // const errorMessage = error.message;
          // // ..
          // console.log(errorCode,errorMessage);
          
          const newUserInfo = {...user};
          newUserInfo.error= error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);

        });
    }
    //signed in
    if(!newUser && user.Email && user.Password){
      const auth = getAuth();
      signInWithEmailAndPassword(auth, user.Email, user.Password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          const newUserInfo={...user};
          newUserInfo.error = '';
          newUserInfo.success =  true;
          setUser(newUserInfo);
          console.log('signed in userInfo',user);
          // ...
        })
        .catch((error) => {
          const newUserInfo = {...user};
          newUserInfo.error= error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    event.preventDefault();
  }

  const updateUserProfile= (name)=>{
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: `${name}`,
    }).then(() => {
      // Profile updated!
      console.log('user profile updated succesfully');
      // ...
    }).catch((error) => {
      // An error occurred
      console.log(error);
      // ...
    });
  }


  return (
    <div className="App">
      <br />
      {
        user.isSignedIn ?<Button variant="info" onClick={()=>signOutButton()}>Sign Out</Button>
        :<Button variant="info" onClick={()=>handleClicked()}>Sign In</Button>
      }
      <br />
      <Button onClick={handleFbSignIn}>Sign In Using Facebook</Button>
      {
          user.isSignedIn&&
          <div>
          <h2>Welcome {user.Name}</h2>
          <h3>Email: {user.Email}</h3>
          <img src={user.Photo} alt="" />          
          </div>
      }
      <h2>Our Own Authentication</h2>
      {/* <p>Name: {user.Name}</p>
      <p>Email: {user.Email}</p>
      <p>Password: {user.Password}</p> */}
        <Form >
        <Form.Group className="mb-3" controlId="formBasicCheckbox" onChange={()=>{setNewUser(!newUser)}}>
            <Form.Check type="checkbox" label="New User Sign Up" /></Form.Group>
        {newUser && <Form.Group className="mb-3 box " controlId="formBasicEmail">
            <Form.Label>Name </Form.Label>
              <Form.Control type="Name" placeholder="Enter Your Name" name="Name" onBlur={handleBlur} />
          </Form.Group> }
          <Form.Group className="mb-3 box " controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" name="Email" onBlur={handleBlur} />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="md-3 box" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" name="Password"  onBlur={handleBlur}/>
            </Form.Group><br/>
          {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group> */}
          <Button variant="primary"  type="submit" onClick={handleSubmit}>
            {newUser ? 'Sign Up' : 'Sign In'}
          </Button>
          <p style={{color:'red'}}>{user.error}</p>
          
          {user.success && <p style={{color:'green'}}>User {newUser ?'created' :'Logged In'} Succesfully</p>}
          </Form>
    </div>
  );
}

export default App;
