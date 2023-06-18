import styled from "styled-components/macro";

export const LogOutButtonRight = styled.button`
  position: fixed;
  top: 10px;
  right: 10px;
`;

export const GoToProfileButton = styled.button`
  position: fixed;
  top: 50px;
  right: 10px;
`;

export const ImageSize = styled.img`
  width: 150px;
  height: 150px;
  padding: 6px;
`;

export const ImagesLeftToRight = styled.div`
  display: inline-flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

export const WikiDataTextSize = styled.p`
  font-size: 14px;
`;

export const WikiDataNoFileTextFormat = styled.p`
  font-size: 10px;
  colour: grey;
  margin: 4px;
`;

export const SocialIconStyling = styled.div`
  justify-content: center;
`;

export const SingleSocialIconStyling = styled.span`
  padding: 07px;
`;

// export const OuterDivForArrayOfNewTracksState = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   align-self: flex-end;

//   width: 800vw;
//   max-width: 1100px;

//   > img {
//     width: 130px;
//     height: 130px;
//     padding: 6px;
//   }

//   > div {
//     width: 180%;
//     display: flex;
//     flex-direction: column;
//     justify-content: space-between;

//   }

//   button {
//     width : 110px;
//     height : 30px;
//     margin-left: 10;
//   }
// `;

export const OuterDivForArrayOfNewTracksState = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
  padding: 4%;

  button {
    margin-left: 90px;
    width: 120px;
  }
`;

export const MoreInfoFlexBox = styled.div`
  display: flex;
  background-color: rgb(119, 119, 119);
  font-family: "Poppins", sans-serif;
  border-radius: 14px;
  padding: 10px;
`;

export const SubtitleH2 = styled.div`
  font-weight: bold;
  color: #fff;
`;

export const AlbumNameAndReleaseDateFlexBox = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AlbumNameAndReleaseDateWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const SocialsFlexBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const ActivePlaylistFlexbox = styled.div`
  display: flex;
  flex-direction: column;
  
  background-color: rgb(119, 119, 119);
font-family: 'Poppins', sans-serif;
border-radius: 14px;
padding : 10px;


}
`;

export const PlaylistSingleLineFlexbox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  button {
    opacity: 0.5;
  }
`;

export const ActivePlaylistTitle = styled.h1`
  display: flex;
  flex-direction: column;
  
  background-color: rgb(119, 119, 119);
font-family: 'Poppins', sans-serif;
border-radius: 14px;
padding : 10px;


}
`;

// export const NavigationBar = styled.span`
// display: flex;
// flex-direction: row;
// justify-content: space-between;
// width: 100%;
// padding : 40px;
// `


export const NavigationBar = styled.span`
display: flex;
flex-direction: column;
font-size: 20px;
background-color: rgb(119, 119, 119);
font-family: 'Poppins', sans-serif;
border-radius: 14px;
padding : 10px;

button {
  font-weight: bold;
  padding : 0px;
  

}

`


export const DormantPlaylistFlexbox = styled.div`
  display: flex;
  flex-direction: column;

  
  background-color: rgb(119, 119, 119);
font-family: 'Poppins', sans-serif;
border-radius: 14px;
padding : 10px;


}
`;

export const DormantPlaylistInline = styled.div`
  display: flex;
  flex-direction: row;

  button {
    opacity: 0.5;
    padding : 0px;

  }
  


}
`;

export const ProfilePageFlexbox = styled.span` 
display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 20px;
`

