/* Unit checks on the shared tax helpers and a few calculator scenarios,
 * computed by hand from the figures in src/tax-data.js. Run: node test/run.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const ctx = { window: {}, document: { readyState: 'complete', addEventListener() {}, getElementById() { return null; }, createElement() { return { style: {}, setAttribute() {}, appendChild() {}, addEventListener() {}, classList: { add() {} } }; }, head: { appendChild() {} }, querySelectorAll() { return []; } }, navigator: {}, console };
ctx.window.document = ctx.document;
vm.createContext(ctx);
for (const f of ['tax-data.js', 'config.js', 'core.js', 'share.js']) vm.runInContext(fs.readFileSync(path.join(ROOT, 'src', f), 'utf8').replace('"__CSS__"', '""').replace(/__VERSION__/g, 'test'), ctx);
const GT = ctx.window.TRPLGivingTools, T = ctx.window.TRPL_TAX;

let fails = 0;
function eq(name, got, want, tol) {
  tol = tol == null ? 0.5 : tol;
  const ok = Math.abs(got - want) <= tol;
  console.log((ok ? 'PASS ' : 'FAIL ') + name + (ok ? '' : `  got ${got} want ${want}`));
  if (!ok) fails++;
}

// --- tax-data sanity -------------------------------------------------------
eq('tax year is current or next', T.taxYear >= new Date().getFullYear() ? 1 : 0, 1, 0);
eq('review date within 15 months', (Date.now() - Date.parse(T.lastReviewed)) / 864e5 < 456 ? 1 : 0, 1, 0);
eq('MFJ standard deduction is 2x single', T.standardDeduction.mfj, T.standardDeduction.single * 2, 0);
eq('QCD split-interest limit is nested in annual limit', T.qcd.splitInterestLimit < T.qcd.annualLimit ? 1 : 0, 1, 0);
eq('ACGA rates rise with age', Object.keys(T.acga.singleLife).every((a, i, arr) => i === 0 || T.acga.singleLife[a] >= T.acga.singleLife[arr[i - 1]]) ? 1 : 0, 1, 0);

// --- helpers ---------------------------------------------------------------
eq('marginal rate MFJ 150k = 22%', GT.marginalRate(150000, 'mfj'), 0.22, 0);
eq('marginal rate single 700k = 37%', GT.marginalRate(700000, 'single'), 0.37, 0);
eq('LTCG single 40k = 0%', GT.ltcgRate(40000, 'single'), 0, 0);
eq('LTCG MFJ 700k = 20%', GT.ltcgRate(700000, 'mfj'), 0.20, 0);
eq('deduction rate capped at 35% for 37% bracket', GT.deductionRate(0.37), 0.35, 0);
eq('std deduction MFJ both 65+', GT.stdDeduction('mfj', 2), 32200 + 2 * 1650, 0);
eq('senior bonus MFJ 2 people, MAGI 200k', GT.seniorBonus('mfj', 2, 200000), 12000 - 0.06 * 50000, 0);
eq('senior bonus fully phased out', GT.seniorBonus('single', 1, 300000), 0, 0);
eq('SALT cap applies', GT.saltAllowed(60000, 'mfj', 300000), 40400, 0);
eq('SALT phase-down at 600k MAGI', GT.saltAllowed(60000, 'mfj', 600000), Math.max(10000, 40400 - 0.3 * 95000), 0);
eq('charitable floor: 10k gift, 200k AGI', GT.charitableAfterFloor(10000, 200000), 9000, 0);
eq('non-itemizer MFJ capped at 2,000', GT.nonItemizerDeduction(5000, 'mfj'), 2000, 0);
eq('life expectancy interpolates (72.5)', GT.lifeExpectancy(72.5), (15.5 + 12.0) / 2, 0.01);
eq('PV annuity 7,000 @5.4% x 12y', GT.pvAnnuity(7000, 0.054, 12), 7000 * (1 - Math.pow(1.054, -12)) / 0.054, 0.01);

// --- QCD scenario (matches the tool's default inputs) ----------------------
{
  const gift = 10000, r = 0.22, agi = 120000;
  const saveQCD = gift * r;                                    // 2,200
  const saveCashNoItemize = GT.nonItemizerDeduction(gift, 'mfj') * r; // 2,000 * .22 = 440
  eq('QCD saves 2,200', saveQCD, 2200, 0);
  eq('cash gift, non-itemizer, saves 440', saveCashNoItemize, 440, 0);
  const saveCashItemize = GT.charitableAfterFloor(gift, agi) * GT.deductionRate(r); // (10000-600)*.22 = 2,068
  eq('cash gift, itemizer, saves 2,068', saveCashItemize, 2068, 0);
  eq('RMD at 73 on 500k', 500000 / T.uniformLifetime[73], 18867.92, 0.01);
}

// --- Stock scenario ---------------------------------------------------------
{
  const fmv = 25000, basis = 8000, cg = 0.15;
  const tax = (fmv - basis) * cg;                              // 2,550
  eq('capital gains tax avoided', tax, 2550, 0);
  eq('cash to charity after sale', fmv - tax, 22450, 0);
}

// --- Bunching scenario (tool defaults) --------------------------------------
{
  const status = 'mfj', agi = 180000, giving = 12000, salt = 14000, mortgage = 9000, N = 3, r = 0.24;
  const std = GT.stdDeduction(status, 0);                      // 32,200
  const base = GT.saltAllowed(salt, status, agi) + mortgage;   // 23,000
  const floor = 0.005 * agi;                                   // 900
  const itemEach = base + (giving - floor);                    // 34,100 > 32,200+2,000? 34,100 vs 34,200 → standard wins
  const eachYear = Math.max(std + GT.nonItemizerDeduction(giving, status), itemEach);
  eq('every-year plan takes standard + 2,000', eachYear, 34200, 0);
  const itemBunch = base + (giving * N - floor);               // 23,000 + 35,100 = 58,100
  const year1 = Math.max(std + GT.nonItemizerDeduction(giving * N, status), itemBunch);
  eq('bunched year 1 itemizes at 58,100', year1, 58100, 0);
  const totalEach = eachYear * N, totalBunch = year1 + Math.max(std, base) * (N - 1);
  eq('bunching adds 19,900 of deductions over 3 years', totalBunch - totalEach, 122500 - 102600, 0);
  eq('≈ 4,776 tax saved at 24%', (totalBunch - totalEach) * r, 4776, 0.5);
}

// --- Estate scenario --------------------------------------------------------
{
  const gross = 20000000, debts = 500000, charity = 2000000, ex = T.estate.exemption;
  const taxable = gross - debts - charity;                     // 17.5M
  const tax = Math.max(0, taxable - ex) * 0.40;                // 2.5M * .4 = 1,000,000
  eq('estate tax on 20M single with 2M bequest', tax, 1000000, 0);
  const taxNoCharity = Math.max(0, gross - debts - ex) * 0.40; // 4.5M*.4 = 1.8M
  eq('bequest saves 800,000', taxNoCharity - tax, 800000, 0);
}

// --- CGA / CRUT illustrations ----------------------------------------------
{
  const gift = 100000, age = 75, rate = T.acga.singleLife[75], r = T.sec7520.rate;
  const pay = gift * rate; eq('CGA payment at 75 = 7,000', pay, 7000, 0.01);
  const le = GT.lifeExpectancy(age), pv = GT.pvAnnuity(pay, r, le), ded = gift - pv;
  eq('CGA deduction between 30% and 50% of gift', ded / gift > 0.30 && ded / gift < 0.50 ? 1 : 0, 1, 0);
  const crut = gift * Math.pow(1 - 0.05, 20);                  // 20-year 5% unitrust ≈ 35.8%
  eq('20-yr 5% CRUT remainder ≈ 35,849', crut, 35848.59, 0.01);
  eq('CRUT passes 10% test', crut >= 0.1 * gift ? 1 : 0, 1, 0);
}

// --- ND charitable giving credit -------------------------------------------
{
  const c = T.ndCredit;
  eq('ND credit: 25k endowment gift, single → 10,000 cap', Math.min(25000 * c.rate, c.maxIndividual), 10000, 0);
  eq('ND credit: 30k gift MFJ → 12,000', Math.min(30000 * c.rate, c.maxJoint), 12000, 0);
  eq('ND credit: 4,999 gift is below minimum', 4999 < c.minGift ? 1 : 0, 1, 0);
  var SC = T.stateCharitable, scKeys = Object.keys(SC);
  eq('State chart: 50 states + DC', scKeys.length, 51, 0);
  eq('State chart: every row has a valid benefit kind', scKeys.filter(function (k) { return ['none','nodeduct','federal','nonitemizer','credit'].indexOf(SC[k].benefit) < 0; }).length, 0, 0);
  eq('State chart: no-income-tax states have zero rate', scKeys.filter(function (k) { return SC[k].benefit === 'none' && SC[k].rate !== 0; }).length, 0, 0);
  eq('State chart: 9 states with no income tax', scKeys.filter(function (k) { return SC[k].benefit === 'none'; }).length, 9, 0);
  eq('ND credit: entity (estate) 30k gift → 10,000 cap, no minimum', Math.min(30000 * c.rate, c.maxBusiness), 10000, 0);
  eq('ND credit vs deduction: 25k at 2.5% top rate = 625', 25000 * T.ndBrackets.mfj[T.ndBrackets.mfj.length - 1][1], 625, 0);
  // ND tax on 150k MFJ taxable: (150,000 - 82,800) * 1.95% = 1,310.40
  const b = T.ndBrackets.mfj; let tax = 0, lo = 0; for (const [hi, r] of b) { if (150000 > lo) tax += (Math.min(150000, hi) - lo) * r; lo = hi; if (150000 <= hi) break; }
  eq('ND tax on 150k MFJ ≈ 1,310', tax, 1310.4, 0.01);
  eq('40% credit exceeds federal 15% de minimis → deduction reduced', c.rate > T.stateCreditRule.deMinimis ? 1 : 0, 1, 0);
}

console.log(fails ? `\n${fails} check(s) failed` : '\nAll checks passed');
process.exit(fails ? 1 : 0);
