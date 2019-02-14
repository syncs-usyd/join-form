function showSuccess(name) {
  $("#success-name").text(name);
  $("#success-alert").show();
}

$("#join-form").on("submit", ev => {
  ev.preventDefault();

  var fd = new FormData(ev.target);
  var international = fd.get("international") || null;
  if (international !== null) international = !!+international;

  var givenName = fd.get("firstName");
  var data = {
    firstName: givenName,
    lastName: fd.get("lastName"),
    gender: fd.get("gender") || undefined,
    email: fd.get("email"),
    access: +fd.get("access") || undefined,
    sid: +fd.get("sid") || undefined,
    newsletter: fd.get("newsletter") == "on",
    doingIT: fd.get("doingIT") == "on",
    registered: true,
    expectedGradYear: +fd.get("expectedGradYear") || undefined,
    international: international
  };

  $("#submit").attr("disabled", true);
  $("#submit-spinner").removeClass("collapse");

  console.log(data);

  fetch("https://api.suits.org.au/members", {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(data)
  })
    .then(_ => {
      showSuccess(givenName);
      ev.target.reset();
      $("#givenName").focus();
    })
    .catch(error => {
      console.error(error);
      $("#error-alert").show();
    })
    .finally(() => {
      $("#submit-spinner").addClass("collapse");
      $("#submit").attr("disabled", false);
    });
});
$("#submit").attr("type", "submit");

$("#expected-grad-year").attr("min", new Date().getFullYear());

$("#success-close").on("click", _ => $("#success-alert").hide());
$("#error-close").on("click", _ => $("#error-alert").hide());
