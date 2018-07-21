module.exports = function (canvas, ctx) {
  const {width, height} = canvas
  const centerX = width / 2;
  const centerY = height / 2;
  const pad = width >= 48 ? Math.round(width / 2 * 0.10) : 0;
  const radius = (width - pad * 2) / 2;
  const innerRadius = radius * (width / 2 >= 128 ? 0.9 : 1);

  drawShell(ctx, centerX, centerY, innerRadius, 2);
  ctx.fillStyle = '#444444';
  ctx.fill();

  drawShell(ctx, centerX, centerY, radius, 1.25);
  ctx.fillStyle = '#17ACE7';
  ctx.fill();

  function drawShell(ctx, x, y, radius, scale) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, scale * Math.PI, false);
    ctx.closePath();
  }
}
