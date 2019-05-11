export const directxCode = `
void enableBlending() {
  d3dDevice->SetRenderState(D3DRS_ALPHABLENDENABL, TRUE);
  d3dDevice->SetRenderState(D3DRS_SRCBLEND, D3DBLEND_SRCCOLOR);
  d3dDevice->SetRenderState(D3DRS_DESTBLEND, D3DBLEND_INVSRCCOLOR);
}
`
