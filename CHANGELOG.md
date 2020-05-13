# Changelog

## 0.8.15
- Reduce MAX_SYNC_UPDATES from 50 to 40. (#239)

## 0.8.14
- minSize property should not be ignored for 'variable' type. (#238)

## 0.8.11
- Reduce MAX_SYNC_UPDATES to 50 to match [upstream
  changes](https://github.com/facebook/react/pull/13163).

## 0.8.10
- Add `scrollParentViewportSizeGetter` prop.

## 0.8.7
- Remove `findDOMNode` (and consequently the `react-dom` peer dependency) in
  favor of the preferred `ref={c => this.el = c}` pattern.

## 0.8.6
- Add `minSize` prop to ensure a list is always at least `minSize` elements
  large.

## 0.8.5
- Use `prop-types` package instead of `React.PropTypes`.

## 0.8.4
- Non-`uniform` type lists with a `window` scroll parent will no longer render
  an initial page unless they are visible in the viewport. (#143)

## 0.8.3
- Use `setTimeout` to detect stack overflow.

## 0.8.2
- Fix issue with misconfiguration detection. (#160)

## 0.8.1
- Provide an error message if the list reaches an unstable state due to
  misconfiguration. (#156, #157)

## 0.8.0
- Dramatically reduced the number of `setState` calls which should yield better
  performance.
- Because of the reduced `setState` calls, the shallow equality check in
  `shouldComponentUpdate` has been removed which should lead to less confusion
  when attempting to re-render list items.
- No changes should need to be made by component consumers, but I've bumped the
  minor version because the `shouldComponentUpdate` change is significant.

## 0.7.22
- Properly register and deregister event handlers with options. (#131)

## 0.7.21
- Enable passive option in scroll and mousewheel event handlers. (#129)

## 0.7.20
- Fix body scroll size bug. (#117)

## 0.7.19
- Add `itemSizeEstimator` prop. (#113)
- Add `useStaticSize` prop. (#116)

## 0.7.17
- Fix issue where nested list positions were not scrolled to correctly. (#105)

## 0.7.16
- Fix Chrome rendering issues when scrolling very quickly. (#58, #96)

## 0.7.15
- Add React 15.0.0-rc.1 to dependency range.

## 0.7.14
- Fix regression introduced in #85 where the height of lists with multiple items
  per row would be off by one.

## 0.7.13
- Fixed a glitch where the list would sometimes flicker at the edge of iOS
  "rubber band" scrolling.

## 0.7.12
- Fixed an issue with `scrollTo` and multiple items per row.

## 0.7.9
- Added the `scrollParentGetter` prop.
