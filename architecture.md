Should Pytorch being able to run on mobile determine our mobile framework?  
\+ possible  
\- adds complexity  
\- creates potential blocking scenarios  
\? can we revisit later?  Yes.
\* decision: Pytorch will output to server (desktop for now). Once we have an api, mobile will get pytorch data from API.  

WHat mobile framework should we use?
- IOS Native  
  \? Languages?  
     Objective-C  
     Swift  
- Android Native  
  \? Languages?  
     Java  
     Kotlin  
     Maybe Python  
- Cross-Platform  
  \+ Supports all the phones we use  
  \? Languages?  
    HTML+JavaScript  
    \+ many of us have JS experience, or will get some in this class  
  \? Frameworks?  
     NativeScript  
     React Native  
      \+ Adam has experience with React, so can help
    


ML Framework?
Pytorch - 90%
\+ we know python
\+ working example
Julia - 10%
\+ may be simpler
Decision: Pytorch for V0.0.0  Revisit on v0.0.1
