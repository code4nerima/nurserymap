// Your functions
//
//

function createContent(feature) {
    var popupContents = '<h4>練馬保育園マップ</h4>';
 
    if (feature && feature.properties) {     
        popupContents = "<h4>" + feature.properties.Name + "</h4>";
        popupContents += "<table>"
        
        popupContents += "<tr><td>種別　</td><td>" + feature.properties.Type + "</td></tr>" ;
        popupContents += "<tr><td>電話番号　</td><td>" + feature.properties.TEL + "</td></tr>" ;
        popupContents += "<tr><td>住所　</td><td>" + feature.properties.Add1 + feature.properties.Add2 + "</td></tr>" ;
        popupContents += "<tr><td>定員　</td><td>" + feature.properties.Capall + "</td></tr>" ;
        popupContents += "<tr><td>定員　</td><td>" + feature.properties.Capall + "</td></tr>" ;
        popupContents += "<tr><td>開園　</td><td>" + feature.properties.Open + "</td></tr>" ;
        popupContents += "<tr><td>閉園　</td><td>" + feature.properties.Close_reg + "</td></tr>" ;
        popupContents += "<tr><td>延長　</td><td>" + feature.properties.Close + "</td></tr>" ;
        popupContents += "</table>" ;

        popupContents += "<br />" + "<a href=\"" + feature.properties.Url + "\">" + "詳細" + "</a>" ;
    }

    return popupContents ;
}