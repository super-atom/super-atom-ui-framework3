/**
 * 컴포넌트 네임스페이스
 */
const Components = {
  /**
   ** Layout 컴포넌트
   */
  Layout: {
    init() {
      this.initHeader();
    },
    initHeader() {
      const lnbOpenBtn = document.getElementById('lnbOpenBtn');
    },
  },
  /**
   ** Input 관련 컴포넌트들
   */
  Input: {
    init() {
      this.initEmailValidation();
      this.initMaxLengthValidation();
      this.initMinLengthValidation();
      this.initNumberInput();
      this.initRegNumInput();
      this.initCaptchaInput();
      this.initBottomSheetInput();
      this.initBottomSheetSelectInput();
      this.initDeleteButton();
      this.initAllCheck();
      this.initCheckbox();
      this.initRadioBtn();
      this.initTextArea();
    },

    // E-mail 검증 Input
    initEmailValidation() {
      const emailInputs = document.querySelectorAll(
        'input[data-valid-condition="email"]',
      );
      emailInputs.forEach((input) => {
        input.addEventListener('input', function () {
          const inputContainer = this.closest('.InputContainer');
          const helpText = inputContainer?.querySelector('.Input__help-text');

          if (helpText) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailPattern.test(this.value)) {
              inputContainer.dataset.state = 'valid';
              helpText.style.display = 'none';
            } else {
              inputContainer.dataset.state = 'error';
              helpText.style.display = 'block';
            }
          }
        });
      });
    },

    // 최소 문자열 길이 검증 Input
    initMinLengthValidation() {
      const inputElements = document.querySelectorAll(
        'input[data-valid-condition="minlength"]',
      );

      inputElements.forEach((input) => {
        input.addEventListener('input', function () {
          const inputContainer = this.closest('.InputContainer');
          const helpText = inputContainer?.querySelector('.Input__help-text');

          if (helpText) {
            if (this.value.length > parseInt(this.minLength, 10)) {
              inputContainer.dataset.state = 'valid';
              helpText.style.display = 'none';
            } else {
              inputContainer.dataset.state = 'error';
              helpText.style.display = 'block';
            }
          }
        });
      });
    },

    // 최대 문자열 길이 검증
    initMaxLengthValidation() {
      const inputElements = document.querySelectorAll(
        'input[data-valid-condition="maxlength"]',
      );
      inputElements.forEach((input) => {
        input.addEventListener('input', function () {
          const inputContainer = this.closest('.InputContainer');
          const helpText = inputContainer?.querySelector('.Input__help-text');

          if (helpText) {
            if (this.value.length <= parseInt(this.maxLength, 10)) {
              inputContainer.dataset.state = 'valid';
              helpText.style.display = 'none';
            } else {
              inputContainer.dataset.state = 'error';
              helpText.style.display = 'block';
            }
          }
        });
      });
    },

    // 숫자만 입력 가능한 Input
    initNumberInput() {
      const numberInputs = document.querySelectorAll(
        'input[data-input-only-number="true"]',
      );

      numberInputs.forEach((input) => {
        input.addEventListener('input', function () {
          this.value = this.value.replace(/[^0-9]/g, '');
          const inputContainer = this.closest('.InputContainer');
          const helpText = inputContainer?.querySelector('.Input__help-text');

          if (helpText) {
            if (this.value.length >= parseInt(this.maxLength, 10)) {
              inputContainer.dataset.state = 'valid';
              helpText.style.display = 'none';
            } else {
              inputContainer.dataset.state = 'error';
              helpText.style.display = 'block';
            }
          }
        });
      });
    },

    // 주민등록번호 뒷자리 Input
    initRegNumInput() {
      const regNumInputs = document.querySelectorAll('.InputRegNum__back');

      regNumInputs.forEach((input) => {
        input.addEventListener('input', function () {
          if (this.value.length >= 1) {
            input.closest('.InputRegNum__back-wrap').classList.add('active');
            const maxLength = parseInt(this.maxLength, 10) || 7;
            let value = this.value;

            if (value.length > maxLength) {
              value = value.substring(0, maxLength);
            }

            this.value = value[0] + '●'.repeat(Math.max(0, maxLength - 1));
          }
        });
      });
    },

    // 캡차 Input
    initCaptchaInput() {
      const captchaInputs = document.querySelectorAll('.InputCaptchaContainer');

      captchaInputs.forEach((container) => {
        const input = container.querySelector('input');
        const iconValid = container.querySelector('.InputCaptcha__icon-valid');

        input.addEventListener('input', function () {
          // WARNING : 퍼블리싱에서 캡챠 인증 완료 상태를 표시하기 위한 임시 조건.
          if (this.value.length === 6) {
            if (container.dataset.state === 'valid') {
              iconValid.style.display = 'block';
            } else {
              container.dataset.state = 'error';
              iconValid.style.display = 'none';
            }
          } else {
            iconValid.style.display = 'none';
          }
        });
      });
    },

    // BottomSheet와 연동되는 Input
    initBottomSheetInput() {
      const bottomSheetContainers = document.querySelectorAll(
        '.InputBottomSheetContainer',
      );

      bottomSheetContainers.forEach((container) => {
        const chevronIcon = container.querySelector('.bg-select-chevron-down');

        // 컨테이너 클릭시 아이콘 회전
        container.addEventListener('click', () => {
          if (chevronIcon) {
            chevronIcon.classList.toggle('rotate-180');
          }
        });

        // BottomSheet 닫힐 때 아이콘 되돌리기
        this.bindChevronResetEvents(container, chevronIcon);
      });
    },

    // 바텀시트와 연동되는 Input 기능
    initBottomSheetSelectInput() {
      document.addEventListener(
        'click',
        this.handleSelectTargetClick.bind(this),
      );
    },

    /**
     * 바텀시트 선택 대상 클릭 핸들러
     * @param {Event} e - 클릭 이벤트
     */
    handleSelectTargetClick(e) {
      const selectTarget = e.target.closest('[data-select-target]');
      if (!selectTarget) return;

      const targetValue = selectTarget.dataset.selectTarget;
      const bottomSheetContent = selectTarget.closest('.BottomSheet__content');
      const checkboxGroup =
        bottomSheetContent?.querySelector('.checkbox-group');
      const isMultiple = checkboxGroup?.dataset.checkboxMultiple === 'true';

      this.updateCheckboxStates(checkboxGroup, selectTarget, isMultiple);
      this.updateInputValue(bottomSheetContent, targetValue);

      if (!isMultiple) {
        this.closeBottomSheetFromContent(bottomSheetContent);
      }
    },

    /**
     * 체크박스 상태 업데이트
     * @param {HTMLElement} checkboxGroup - 체크박스 그룹 요소
     * @param {HTMLElement} selectTarget - 선택된 대상 요소
     * @param {boolean} isMultiple - 여러 선택 가능 여부
     */
    updateCheckboxStates(checkboxGroup, selectTarget, isMultiple) {
      if (!checkboxGroup) return;

      const allSelectTargets = checkboxGroup.querySelectorAll(
        '[data-select-target]',
      );

      if (!isMultiple) {
        allSelectTargets.forEach((el) => {
          const label = el.closest('label');
          const checkbox = label?.querySelector('input[type="checkbox"]');
          if (checkbox) checkbox.checked = false;
          el.classList.remove('active');
        });
      }

      // 선택된 요소 토글
      selectTarget.classList.toggle('active');
    },

    /**
     * 연결된 input 값 업데이트
     * @param {HTMLElement} bottomSheetContent - 바텀시트 콘텐츠 요소
     * @param {string} targetValue - 선택된 값
     */
    updateInputValue(bottomSheetContent, targetValue) {
      const bottomSheet = bottomSheetContent?.closest('[id]');
      const bottomSheetId = bottomSheet?.id;
      const targetInput = document.querySelector(
        `[data-bottomsheet-opener="${bottomSheetId}"]`,
      );

      if (targetInput && targetInput.tagName === 'INPUT') {
        targetInput.value = targetValue;
        targetInput.dataset.select = targetValue;
        this.resetChevronIcon(targetInput);
      }
    },

    /**
     * input과 연결된 chevron 아이콘 초기화
     * @param {HTMLElement} targetInput - 대상 input 요소
     */
    resetChevronIcon(targetInput) {
      const inputContainer = targetInput.closest('.InputBottomSheetContainer');
      const chevronIcon = inputContainer?.querySelector(
        '.bg-select-chevron-down',
      );
      chevronIcon?.classList.remove('rotate-180');
    },

    /**
     * 바텀시트 콘텐츠로부터 바텀시트 닫기
     * @param {HTMLElement} bottomSheetContent - 바텀시트 콘텐츠 요소
     */
    closeBottomSheetFromContent(bottomSheetContent) {
      const bottomSheet = bottomSheetContent?.closest('[id]');
      const bottomSheetId = bottomSheet?.id;
      if (bottomSheetId) {
        Components.BottomSheet.close(bottomSheetId);
      }
    },

    /**
     * 전체 선택 체크박스 기능 초기화
     * allCheck 클래스를 가진 체크박스가 선택되면 모든 개별 체크박스를 선택/해제
     */
    initAllCheck() {
      document.addEventListener('change', (event) => {
        const target = event.target;

        // allCheck 체크박스가 변경된 경우
        if (
          target.classList.contains('allCheck') &&
          target.type === 'checkbox'
        ) {
          const checkboxGroup = target.closest('.checkbox-group');
          if (checkboxGroup) {
            const individualCheckboxes = checkboxGroup.querySelectorAll(
              'input[type="checkbox"][required]:not(.allCheck)',
            );
            const isChecked = target.checked;

            // 모든 개별 체크박스 상태 변경
            individualCheckboxes.forEach((checkbox) => {
              checkbox.checked = isChecked;

              // 체크박스와 연결된 버튼의 active 클래스 토글
              const label = checkbox.closest('label');
              const btn = label?.querySelector('div[role="button"]');
              if (btn) {
                if (isChecked) {
                  btn.classList.add('active');
                } else {
                  btn.classList.remove('active');
                }
              }
            });
          }
        }

        // 개별 체크박스가 변경된 경우 전체 선택 상태 업데이트
        if (
          !target.classList.contains('allCheck') &&
          target.type === 'checkbox'
        ) {
          const checkboxGroup = target.closest('.checkbox-group');
          if (checkboxGroup) {
            const allCheckbox = checkboxGroup.querySelector('.allCheck');
            const individualCheckboxes = checkboxGroup.querySelectorAll(
              'input[type="checkbox"][required]:not(.allCheck)',
            );

            if (allCheckbox && individualCheckboxes.length > 0) {
              const checkedCount = Array.from(individualCheckboxes).filter(
                (cb) => cb.checked,
              ).length;

              // 모든 개별 체크박스가 선택된 경우 전체 선택 체크
              allCheckbox.checked =
                checkedCount === individualCheckboxes.length;

              // 전체 선택 체크박스와 연결된 버튼의 active 클래스 토글
              const allLabel = allCheckbox.closest('label');
              const allBtn = allLabel?.querySelector('div[role="button"]');
              if (allBtn) {
                if (allCheckbox.checked) {
                  allBtn.classList.add('active');
                } else {
                  allBtn.classList.remove('active');
                }
              }
            }
          }
        }
      });
    },

    bindChevronResetEvents(container, chevronIcon) {
      const bottomSheetOpener = container.querySelector(
        '[data-bottomsheet-opener]',
      );

      if (bottomSheetOpener) {
        bottomSheetOpener.addEventListener('click', function () {
          const targetId = this.dataset.bottomsheetOpener;
          const bottomSheet = document.querySelector(`#${targetId}`);

          if (bottomSheet) {
            const closeButton = bottomSheet.querySelector(
              '.BottomSheet__btn-close',
            );

            if (
              closeButton &&
              !closeButton.hasAttribute('data-chevron-bound')
            ) {
              closeButton.addEventListener('click', () => {
                if (chevronIcon) {
                  chevronIcon.classList.remove('rotate-180');
                }
              });
              closeButton.setAttribute('data-chevron-bound', 'true');
            }
          }
        });
      }

      // dim 클릭시에도 아이콘 되돌리기
      const dim = document.querySelector('.BottomSheet__dim');
      if (dim && !dim.hasAttribute('data-chevron-bound')) {
        dim.addEventListener('click', () => {
          if (chevronIcon) {
            chevronIcon.classList.remove('rotate-180');
          }
        });
        dim.setAttribute('data-chevron-bound', 'true');
      }
    },

    // 삭제 버튼 기능
    initDeleteButton() {
      // 삭제 버튼 클릭 이벤트
      document.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-input-delete')) {
          const input = event.target
            .closest('.InputWrapper')
            ?.querySelector('input');
          if (input) {
            input.value = '';
            input.focus();
          }
        }
      });

      // 포커스 이벤트로 삭제 버튼 표시/숨김
      document.addEventListener('focusin', (event) => {
        if (event.target.tagName === 'INPUT') {
          const deleteButton = event.target
            .closest('.InputWrapper')
            ?.querySelector('.btn-input-delete');
          if (deleteButton) {
            deleteButton.style.display = 'block';
          }
        }
      });

      document.addEventListener('focusout', (event) => {
        if (event.target.tagName === 'INPUT') {
          const deleteButton = event.target
            .closest('.InputWrapper')
            ?.querySelector('.btn-input-delete');
          if (deleteButton) {
            setTimeout(() => {
              deleteButton.style.display = 'none';
            }, 100);
          }
        }
      });

      // input 이벤트가 발생하면 삭제 버튼 다시 표시
      document.addEventListener('input', (event) => {
        if (event.target.tagName === 'INPUT') {
          const deleteButton = event.target
            .closest('.InputWrapper')
            ?.querySelector('.btn-input-delete');
          if (deleteButton) {
            deleteButton.style.display = 'block';
          }
        }
      });
    },

    // 250707 수정
    initCheckbox() {
      const checkboxGroups = document.querySelectorAll('.checkbox-group');

      // 250715 추가
      // 체크박스 키보드 접근성 개선 - Enter 키로 체크박스 토글
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((checkbox) => {
        const label = checkbox.closest('label');
        if (label) {
          label.setAttribute('tabindex', '0'); // label에 tabindex 추가
          label.addEventListener('keydown', (event) => {
            if (event.code === 'Enter' || event.key === 'Enter') {
              event.preventDefault();
              checkbox.checked = !checkbox.checked;
              // 체크박스 상태 변경 이벤트 발생
              checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            }
          });
        }
      });

      checkboxGroups.forEach((group) => {
        const allCheck = group.querySelector('.allCheck');
        const checkboxes = group.querySelectorAll(
          'input[type="checkbox"]:not(.allCheck)',
        );
        const individualCheckboxes = group.querySelectorAll(
          'input[type="checkbox"][required]:not(.allCheck)',
        );

        if (!allCheck || individualCheckboxes.length === 0) return;

        // 250806 수정 : 필수 항목만 체크하도록 전체 체크 제거
        // 전체 선택 체크박스 클릭 이벤트
        // allCheck.addEventListener('change', function () {
        //   checkboxes.forEach((checkbox) => {
        //     checkbox.checked = this.checked;
        //   });
        // });

        // 개별 체크박스 클릭 이벤트
        individualCheckboxes.forEach((checkbox) => {
          checkbox.addEventListener('change', () => {
            this.updateAllCheckState(allCheck, individualCheckboxes);
          });
        });

        // 초기 상태 설정
        this.updateAllCheckState(allCheck, individualCheckboxes);
      });

      // 프로그램 체크박스
      const programCheckboxes = document.querySelectorAll(
        '[data-theme="program"] input[type="checkbox"]',
      );

      programCheckboxes.forEach((checkbox) => {
        // 체크박스 상태에 따라 label 클래스 토글
        checkbox.addEventListener('change', () => {
          const label = checkbox.closest('.checkbox__label');
          if (label) {
            label.classList.toggle('active', checkbox.checked);
          }
        });
      });
    },

    // 전체 선택 체크박스 상태 업데이트
    updateAllCheckState(allCheck, individualCheckboxes) {
      const checkedCount = Array.from(individualCheckboxes).filter(
        (checkbox) => checkbox.checked,
      ).length;

      const totalCount = individualCheckboxes.length;

      if (checkedCount === 0) {
        // 모두 체크 해제된 경우
        allCheck.checked = false;
        allCheck.indeterminate = false;
      } else if (checkedCount === totalCount) {
        // 모두 체크된 경우
        allCheck.checked = true;
        allCheck.indeterminate = false;
      } else {
        // 일부만 체크된 경우 (중간 상태)
        allCheck.checked = false;
        allCheck.indeterminate = true;
      }
    },

    initRadioBtn() {
      const radioBtns = document.querySelectorAll('input[type="radio"]');

      radioBtns.forEach((radio) => {
        // 체크박스 상태에 따라 label 클래스 토글
        radio.addEventListener('change', () => {
          const group = radio.closest('.radio-group');
          const label = radio.closest('.radio__label');
          if (label) {
            group.querySelectorAll('.radio__label').forEach((label) => {
              label.classList.remove('active');
            });
            label.classList.toggle('active');
            radio.checked = this.checked;
          }
        });
      });
    },

    initTextArea() {
      const textAreas = document.querySelectorAll(
        '.InputTextAreaContainer textarea',
      );

      textAreas.forEach((textArea) => {
        // 입력 이벤트 핸들러
        textArea.addEventListener('input', function () {
          // input 이벤트 발생시 .InputTextArea__counter > .current를 maxlength값 이하로 증가
          const counter = this.closest(
            '.InputTextAreaContainer',
          )?.querySelector('.InputTextArea__counter > .current');
          if (counter) {
            const maxLength = parseInt(this.maxLength, 10) || 0;
            const currentLength = this.value.length;

            // 현재 입력 길이가 maxlength 이하인 경우에만 증가
            if (currentLength <= maxLength) {
              counter.textContent = currentLength;
            } else {
              // maxlength를 초과한 경우에는 maxlength로 설정
              counter.textContent = maxLength;
            }
          }
        });
      });
    },
  },

  /**
   ** 아코디언 메뉴 컴포넌트
   */
  Accordion: {
    /**
     * 아코디언 컴포넌트 초기화
     */
    init() {
      this.bindEvents();
    },

    /**
     * 아코디언 이벤트 바인딩
     */
    bindEvents() {
      const accordionHeaders = document.querySelectorAll('.accordion-header');

      accordionHeaders.forEach((header) => {
        header.addEventListener('click', (event) => {
          this.toggleAccordion(event.currentTarget);
        });
      });
    },

    /**
     * 아코디언 토글 기능
     * @param {HTMLElement} header - 클릭된 아코디언 헤더
     */
    toggleAccordion(header) {
      const targetId = header.getAttribute('data-accordion-target');
      const content = document.getElementById(targetId);
      const icon = header.querySelector('.accordion-icon');

      if (!content) return;

      // 현재 아코디언이 열려있는지 확인
      const isOpen = !content.classList.contains('hidden');

      if (isOpen) {
        icon.classList.remove('active');
        icon.classList.remove('bg-accordion-expand--open');
        // 아코디언 닫기
        this.closeAccordion(content, icon);
      } else {
        icon.classList.add('active');
        icon.classList.add('bg-accordion-expand--open');
        // 다른 열려있는 아코디언들 모두 닫기 (단일 선택 방식)
        // this.closeAllAccordions();
        // 선택된 아코디언 열기
        this.openAccordion(content, icon);
      }
    },

    /**
     * 아코디언 열기
     * @param {HTMLElement} content - 아코디언 콘텐츠
     * @param {HTMLElement} icon - 아코디언 아이콘
     */
    openAccordion(content, icon) {
      content.classList.remove('hidden');
      // 부드러운 애니메이션을 위해 약간의 지연 후 클래스 추가
      setTimeout(() => {
        content.classList.add('accordion-open');
      }, 10);
    },

    /**
     * 아코디언 닫기
     * @param {HTMLElement} content - 아코디언 콘텐츠
     * @param {HTMLElement} icon - 아코디언 아이콘
     */
    closeAccordion(content, icon) {
      content.classList.remove('accordion-open');

      // 애니메이션 완료 후 hidden 클래스 추가
      setTimeout(() => {
        content.classList.add('hidden');
      }, 200);
    },

    /**
     * 모든 아코디언 닫기
     */
    closeAllAccordions() {
      const allContents = document.querySelectorAll('.accordion-content');

      allContents.forEach((content) => {
        content.classList.remove('accordion-open');
        setTimeout(() => {
          content.classList.add('hidden');
        }, 200);
      });
    },
  },
};

/**
 ** DOM 로드 완료시 모든 컴포넌트 초기화
 */
document.addEventListener('DOMContentLoaded', () => {
  Components.Layout.init();
  Components.Input.init();
  Components.Accordion.init();
});
