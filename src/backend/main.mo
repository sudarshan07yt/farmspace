import Text "mo:core/Text";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type Location = {
    latitude : Float;
    longitude : Float;
  };

  public type DiagnosisSession = {
    id : Nat;
    user : Principal;
    crop : Text;
    symptoms : Text;
    soilType : Text;
    location : Location;
    image : ?Storage.ExternalBlob;
    solution : Solution;
    timestamp : Int;
  };

  public type FarmingTip = {
    category : Text;
    title : Text;
    content : Text;
    timestamp : Int;
  };

  public type Solution = {
    causes : Text;
    treatmentSteps : Text;
    organicSolutions : Text;
    chemicalSolutions : Text;
    preventiveMeasures : Text;
  };

  var nextDiagnosisId = 1;
  let diagnosisSessions = Map.empty<Nat, DiagnosisSession>();
  let farmingTips = Map.empty<Nat, FarmingTip>();
  let locationIdMap = Map.empty<Text, Location>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  module DiagnosisSession {
    public func compareByTimestamp(a : DiagnosisSession, b : DiagnosisSession) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
    };
  };

  module FarmingTip {
    public func compareByTimestamp(a : FarmingTip, b : FarmingTip) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
    };
  };

  public shared ({ caller }) func submitDiagnosis(params : {
    crop : Text;
    symptoms : Text;
    soilType : Text;
    locationId : Text;
    suggestion : Solution;
  }) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit diagnoses");
    };
    let diagnosisId = nextDiagnosisId;
    nextDiagnosisId += 1;
    let location = switch (locationIdMap.get(params.locationId)) {
      case (?loc) { loc };
      case (null) { Runtime.trap("Location not found. Please confirm your coordinates.") };
    };
    let diagnosis : DiagnosisSession = {
      id = diagnosisId;
      user = caller;
      crop = params.crop;
      symptoms = params.symptoms;
      soilType = params.soilType;
      location;
      image = null;
      solution = params.suggestion;
      timestamp = Time.now();
    };
    diagnosisSessions.add(diagnosisId, diagnosis);
    diagnosisId;
  };

  public shared ({ caller }) func addImageToDiagnosis(diagnosisId : Nat, image : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update diagnoses");
    };
    switch (diagnosisSessions.get(diagnosisId)) {
      case (?diagnosis) {
        if (diagnosis.user != caller) {
          Runtime.trap("Only the owner can update this diagnosis");
        };
        let updatedDiagnosis : DiagnosisSession = {
          id = diagnosis.id;
          user = diagnosis.user;
          crop = diagnosis.crop;
          symptoms = diagnosis.symptoms;
          soilType = diagnosis.soilType;
          location = diagnosis.location;
          image = ?image;
          solution = diagnosis.solution;
          timestamp = diagnosis.timestamp;
        };
        diagnosisSessions.add(diagnosisId, updatedDiagnosis);
      };
      case (null) { Runtime.trap("Diagnosis not found") };
    };
  };

  public shared ({ caller }) func addLocation(locationId : Text, latitude : Float, longitude : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add locations");
    };
    let location : Location = {
      latitude;
      longitude;
    };
    locationIdMap.add(locationId, location);
  };

  public query ({ caller }) func getDiagnosisSessionsByUser(user : Principal) : async [DiagnosisSession] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own diagnoses");
    };
    diagnosisSessions.values().toArray().filter(func(diagnosis) { diagnosis.user == user }).sort(DiagnosisSession.compareByTimestamp);
  };

  public query ({ caller }) func getDiagnosisSession(id : Nat) : async DiagnosisSession {
    switch (diagnosisSessions.get(id)) {
      case (?diagnosis) {
        if (diagnosis.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own diagnoses");
        };
        diagnosis;
      };
      case (null) { Runtime.trap("Diagnosis session not found") };
    };
  };

  public query ({ caller }) func getAllDiagnosisSessions() : async [DiagnosisSession] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all diagnoses");
    };
    let sessions = diagnosisSessions.values().toArray();
    sessions.sort(DiagnosisSession.compareByTimestamp);
  };

  public shared ({ caller }) func submitFarmingTip(category : Text, title : Text, content : Text) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can submit farming tips");
    };
    let tipId = farmingTips.size();
    let tip : FarmingTip = {
      category;
      title;
      content;
      timestamp = Time.now();
    };
    farmingTips.add(tipId, tip);
    tipId;
  };

  public query ({ caller }) func getAllFarmingTips() : async [FarmingTip] {
    let tips = farmingTips.values().toArray();
    tips.sort(FarmingTip.compareByTimestamp);
  };

  public query ({ caller }) func getFarmingTipsByCategory(category : Text) : async [FarmingTip] {
    let tips = farmingTips.values().toArray();
    tips.filter(func(tip) { Text.equal(tip.category, category) }).sort(FarmingTip.compareByTimestamp);
  };
};
