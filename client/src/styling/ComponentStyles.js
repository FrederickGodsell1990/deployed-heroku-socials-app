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
  padding : 6px;
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
margin : 4px;
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
    margin-left : 90px;
    width : 120px;
  }

`;


export const MoreInfoFlexBox = styled.div`
display: flex;
background-color: rgb(119, 119, 119);
`;





export const ArtistSocialsFlexBox = styled.div`
display: flex;
  flex-direction: row;
`;

export const AlbumNameAndReleaseDateFlexBox = styled.div`
display: flex;
  flex-direction: column;
`;