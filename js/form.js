// お問い合わせ／配布スタッフ応募フォームの送信（Formspree AJAX）
// 送信後はページを移動せず、その場で完了メッセージを表示する。
// contact.html・recruit.html の両方で共用（<form class="form"> を対象）。
document.addEventListener('submit', function (e) {
  var form = e.target.closest('form.form');
  if (!form) return;

  e.preventDefault();

  var action = form.getAttribute('action') || '';
  // Formspreeのエンドポイント未設定のうちは送信できない（準備中）
  if (action.indexOf('formspree.io') === -1) {
    alert('送信先（Formspree）がまだ設定されていません。\nお急ぎの場合はお電話（0467-91-1611）でご連絡ください。');
    return;
  }

  var btn = form.querySelector('button[type="submit"]');
  var label = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = '送信中…'; }

  function fail(msg) {
    if (btn) { btn.disabled = false; btn.textContent = label; }
    alert(msg + '\nお急ぎの場合はお電話（0467-91-1611）でご連絡ください。');
  }

  function showDone() {
    var done = document.createElement('div');
    done.setAttribute('role', 'status');
    done.style.cssText = 'max-width:480px;margin:8px auto;background:#f3f8f4;border:1px solid #cfe0d4;border-radius:16px;padding:28px 24px;text-align:center;color:#243b32;line-height:1.9;';
    done.innerHTML =
      '<p style="font-family:\'Zen Old Mincho\',serif;font-size:19px;font-weight:700;margin:0 0 10px;">送信を受け付けました</p>' +
      '<p style="font-size:15px;margin:0;">内容を確認のうえ、担当者よりご連絡します。<br>2〜3日経っても連絡がない場合はお電話ください。</p>' +
      '<p style="margin:14px 0 0;"><a href="tel:0467911611" style="font-family:\'Zen Old Mincho\',serif;font-weight:700;font-size:20px;color:#2f6950;text-decoration:none;">☎ 0467-91-1611</a></p>';
    form.parentNode.replaceChild(done, form);
    done.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  fetch(action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  }).then(function (res) {
    if (res.ok) {
      showDone();
    } else {
      res.json().then(function (data) {
        var msg = (data && data.errors)
          ? data.errors.map(function (x) { return x.message; }).join('、')
          : '送信に失敗しました。';
        fail(msg);
      }).catch(function () { fail('送信に失敗しました。'); });
    }
  }).catch(function () {
    fail('通信エラーが発生しました。時間をおいて再度お試しください。');
  });
});
