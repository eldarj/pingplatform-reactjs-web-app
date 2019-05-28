export default class ImageUtils {

    static defaultAvatarUrl = "/images/user/default/profile_avatar_placeholder.png";

    static getAvatarImage = (avatarImageUrl) => {
        return avatarImageUrl != null ? avatarImageUrl : this.defaultAvatarUrl;
    }

    static checkImage = (imageUrl, defaultUrl) => {
        let httpClient = new XMLHttpRequest();

        if ("withCredentials" in httpClient)
        {
            httpClient.open('get', imageUrl, true);
        } 
        else if (typeof XDomainRequest !== "undefined")
        {
            httpClient.open('get', imageUrl);
        } 

        httpClient.send();
        return httpClient.status !== 200 ? defaultUrl : imageUrl;
    }
}