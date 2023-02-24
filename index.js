const express = require("express");
var request = require("request");

function getDomainUsersList(JWT, page) {
  try {
    return new Promise((resolve, reject) => {
      var options = {
        method: "GET",
        url:
          "https://www.googleapis.com/admin/directory/v1/users?pageToken=" +
          page,
        qs: {
          customer: "C03nvy61k",
          maxResults: "500",
          projection: "full",
          viewType: "admin_view",
          orderBy: "email",
        },
        headers: {
          authorization: "Bearer " + JWT,
        },
      };

      request(options, function (error, response, body) {
        if (error) {
          console.log("getProfile error : " + error);
          rejectJSON.message =
            "could not retrieve gsuite profile error : " + error;
          reject(rejectJSON);
        }

        var data = JSON.parse(body);

        // if (data.nextPageToken) {
        //   getDomainUsersList(JWT, data.nextPageToken)
        //     .then(function (value) {
        //       resolve(data.users.concat(value));
        //     })
        //     .catch(function (error) {
        //       console.log(error);
        //     });
        // } else {
        //   resolve(data.users);
        // }

        resolve(data.users);
      });
    });
  } catch (e) {
    console.log("catch error: " + e);
    return error;
  }
}

function getList(data) {
  try {
    return new Promise((resolve, reject) => {
      var infos = [];
      var names = [];
      var nicknames = [];
      var entityLegalID = []; 
      var jobID = [];

      for (var i = 0; i < data.length; i++) {
        var datum = data[i];

        if (datum.customSchemas) {
          if (datum.customSchemas.HR_PROFILE) {
            if ((datum.customSchemas.HR_PROFILE.entityLegalID != null || datum.customSchemas.HR_PROFILE.entityLegalID != undefined) && 
                datum.relations != null || datum.relations != undefined){
              if(datum.customSchemas.HR_PROFILE.entityLegalID === "DEVOTEAM SAS" || datum.customSchemas.HR_PROFILE.entityLegalID === "Devoteam Creative Technology France"){
                if(datum.relations != null && datum.relations != undefined){
                    infos.push([
                      "Email: " + datum.primaryEmail,
                      "FirstName: " + datum.name.givenName,
                      "LastName: " + datum.name.familyName,
                      "Manager: " + datum.relations[0].value,
                      "entityLegalID: " + datum.customSchemas.HR_PROFILE.entityLegalID,
                      "JobID: " + datum.customSchemas.HR_PROFILE.jobID
                    ]);
                      let managers = datum.relations[0].value;
                      console.log(managers);
                  }
                }
            }
          }
        }
        console.log(infos);
        //console.log(infos.length);
      }

      resolve(infos, names, nicknames, entityLegalID, jobID);
    });
  } catch (e) {
    console.log("catch error: " + e);
    return error;
  }
}

async function test() {
  try {
    //https://www.googleapis.com/auth/admin.directory.user
    var token =
      "ya29.a0AVvZVsrsKvqzQqvB1mseC0XkZQaRC5MlQMW97KdopXcy1wmM_d1u_wCcKneEPeZ1bnerTJZuwaPh5-7UqnkFw23wAVTj2V7zv8LT0noFjtIg3PLcAKdjBH7SvqkJsNltXLH8ed7_AouV-1eBo_Hqc6rTUiqaaCgYKAR4SARMSFQGbdwaI32foyLYH5jWuSJZwFoTQ1Q0163"

    getDomainUsersList(token, "")
      .then(function (value) {
        getList(value)
          .then(function (value) {
            // console.log(JSON.stringify(value));
            // console.log(value.length);
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (e) {
    console.log("catch error: " + e);
    return error;
  }
}

test();
